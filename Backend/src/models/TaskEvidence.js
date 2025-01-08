const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskEvidenceSchema = new Schema({
    workOrderTaskId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'WorkOrderTask'
    },
    taskEvidenceOrdering: {
        type: Number,
        required: true
    },
    taskEvidenceType: {
        type: String,
        required: true,
        enum: ['Foto', 'Video', 'Texto', 'Audio', 'File']
    },
    taskEvidenceObservations: {
        type: String,
        required: false
    },
    taskEvidenceUrl: {
        type: String,
        required: false
    },
    taskEvidenceDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    taskEvidenceTechnician: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    taskEvidenceStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Completed', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    taskEvidenceSupervisor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    taskEvidenceObservationsSupervisor: {
        type: String,
        required: function() {
            return this.statusEvidenceAttention === 'Rejected';
        }
    }
},
    {
        timestamps: true
    });


    TaskEvidenceSchema.pre('save', async function(next) {
        if (this.isNew) {
            const lastEvidence = await this.constructor.findOne({ workOrderTaskId: this.workOrderTaskId })
                .sort({ taskEvidenceOrdering: -1 });
            this.taskEvidenceOrdering = lastEvidence ? lastEvidence.taskEvidenceOrdering + 1 : 1;
        }
        next();
    });
module.exports = mongoose.model('TaskEvidence', TaskEvidenceSchema);