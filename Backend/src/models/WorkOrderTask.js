const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkOrderTaskSchema = new Schema({
    workOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'WorkOrder',
        required: true,
        immutable: true
    },
    WorkOrderTaskOrdering: {
        type: Number,
        required: true,
        immutable: true
    },
    workOrderTaskDescription: {
        type: String,
        required: true
    },
    workOrderTaskUpdateDate: {
        type: Date,
        default: Date.now
    },
    workOrderTaskTechnicianRecord: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workOrderTaskStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Approved', 'Rejected'],
        default: 'Pending'
    }
    ,
    workOrderTaskObservationByReject: {
        type: String,
        required: false

    }
},
    {
        timestamps: true
    });
    WorkOrderTaskSchema.pre('save', async function (next) {
        if (this.isNew) {
            const lastTask = await mongoose.model('WorkOrderTask').findOne({ workOrderId: this.workOrderId }).sort('-WorkOrderTaskOrdering');
            this.WorkOrderTaskOrdering = lastTask ? lastTask.WorkOrderTaskOrdering + 1 : 1;
        }
        next();
    });
module.exports = mongoose.model('WorkOrderTask', WorkOrderTaskSchema);