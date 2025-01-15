const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
    workOrderNumber: {
        type: String,
        unique: true,
        immutable: true
    },
    workOrderSupervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        immutable: true
    },
    workOrderDescription: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        enum: ['Inspection', 'Installation', 'Maintenance'],
        required: true
    },
    workOrderStatus: {
        type: String,
        enum: ['Unassigned', 'Assigned', 'In Progress', 'Under Review', 'Approved'],
        required: true,
        default: 'Unassigned'
    },
    workOrderScheduledDate: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!value) return true;
                const now = new Date();
                const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return value >= now && value <= maxDate;
            },
            message: 'Scheduled date must be between the current date and the next 7 days.'
        }
    },
    workOrderEstimatedDuration: {
        type: Number,
        required: true,
        min: 0.25,
        max: 8,
        default: 1
    },
    workOrderAssignedTechnician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    workOrderReasonRejection: {
        type: String
    },
    workOrderAddress: {
        type: String,
    },
    workOrderLocation: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    workOrderclientEmail: {
        type: String,
        immutable: true
    },
    workOrderClientContactPerson: {
        type: String,
    },
    workOrderClientPhone: {
        type: String,
    }
}, {
    timestamps: true
});

workOrderSchema.index({ workOrderLocation: '2dsphere' });

workOrderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Client = mongoose.model('Client');
        const client = await Client.findById(this.clientId);
        if (client) {
            this.workOrderClientPhone = client.clientContactPersonPhone;
            this.workOrderClientContactPerson = client.clientContactPerson;
            this.workOrderclientEmail = client.clientEmail;
            this.workOrderLocation = client.clientGeoLocation;
            this.workOrderAddress = client.clientAddress;
        } else {
            const error = new Error('Client not found.');
            return next(error);
        }
    }
    next();
});
workOrderSchema.pre('save', async function (next) {
    if (this.isNew && this.workOrderSupervisor) {
        const User = mongoose.model('User');
        const supervisor = await User.findById(this.workOrderSupervisor);
        if (!supervisor) {
            const error = new Error('Assigned supervisor does not exist.');
            return next(error);
        }
        if (supervisor.userRole !== 'supervisor') {
            const error = new Error(`Assigned supervisor is a role ${supervisor.userRole}.`);
            return next(error);
        }
    }
    next();
});

workOrderSchema.pre('save', async function (next) {
    if (this.workOrderAssignedTechnician) {
        const User = mongoose.model('User');
        const technician = await User.findById(this.workOrderAssignedTechnician);
        if (!technician) {
            const error = new Error('Assigned technician does not exist.');
            return next(error);
        }
        if (technician.userRole !== 'technician') {
            const error = new Error('Assigned technician is not a role technician.');
            return next(error);
        }
    }
    next();
});

workOrderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Client = mongoose.model('Client');
        const client = await Client.findById(this.clientId);
        if (client) {
            this.workOrderclientEmail = client.clientEmail;
        } else {
            const error = new Error('Client not found.');
            return next(error);
        }
    }
    next();
});

workOrderSchema.pre('save', async function (next) {
    if (this.isModified('workOrderAssignedTechnician') || this.isModified('workOrderScheduledDate') || this.isModified('workOrderEstimatedDuration')) {
        const overlappingWorkOrders = await mongoose.model('WorkOrder').find({
            workOrderAssignedTechnician: this.workOrderAssignedTechnician,
            _id: { $ne: this._id },
            $or: [
                {
                    workOrderScheduledDate: {
                        $lt: new Date(this.workOrderScheduledDate.getTime() + this.workOrderEstimatedDuration * 60 * 60 * 1000),
                        $gt: this.workOrderScheduledDate
                    }
                },
                {
                    workOrderScheduledDate: {
                        $lt: this.workOrderScheduledDate,
                        $gt: new Date(this.workOrderScheduledDate.getTime() - this.workOrderEstimatedDuration * 60 * 60 * 1000)
                    }
                }
            ]
        });

        if (overlappingWorkOrders.length > 0) {
            const error = new Error('The assigned technician has overlapping work orders.');
            return next(error);
        }
    }
    next();
});


workOrderSchema.pre('save', function (next) {
    if (this.workOrderStatus === 'Unassigned' && this.workOrderAssignedTechnician && this.workOrderScheduledDate && this.workOrderEstimatedDuration) {
        this.workOrderStatus = 'Assigned';
    }
    next();
});

workOrderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const currentYear = new Date().getFullYear();
        const count = await mongoose.model('WorkOrder').countDocuments({
            workOrderNumber: new RegExp(`^\\d{4}-${currentYear}$`)
        });
        this.workOrderNumber = `${String(count + 1).padStart(4, '0')}-${currentYear}`;
    }
    next();
});

workOrderSchema.post('save', async function (doc, next) {
    if (doc.workOrderStatus === 'Assigned') {
        const TaskTemplate = mongoose.model('TaskTemplate');
        const WorkOrderTask = mongoose.model('WorkOrderTask');

        const existingTasks = await WorkOrderTask.find({ workOrderId: doc._id });
        if (existingTasks.length > 0) {
            return next();
        }

        const templates = await TaskTemplate.find({ serviceType: doc.serviceType });
        if (!templates) {
            return next();
        }
        const tasks = templates.map(template => ({
            workOrderId: doc._id,
            WorkOrderTaskOrdering: template.taskTemplateOrdering,
            workOrderTaskDescription: template.taskTemplateDescription,
            workOrderTaskTechnicianRecord: doc.workOrderAssignedTechnician,
            workOrderTaskStatus: 'Pending'
        }));

        await WorkOrderTask.insertMany(tasks);
    }
    next();
});

workOrderSchema.pre('save', async function (next) {
    if (this.isModified('workOrderStatus') && this.workOrderStatus === 'Under Review') {
        const WorkOrderTask = mongoose.model('WorkOrderTask');
        const tasks = await WorkOrderTask.find({ workOrderId: this._id });

        const allTasksCompleted = tasks.every(task => task.workOrderTaskStatus === 'Completed');
        if (!allTasksCompleted) {
            const error = new Error('All tasks must be completed before setting the work order status to Under Review.');
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);