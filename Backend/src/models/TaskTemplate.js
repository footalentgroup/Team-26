const mongoose = require('mongoose');

const TaskTemplateSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        enum: ['inspection', 'installation', 'maintenance'],
        required: true
    },
    taskTemplateOrdering: {
        type: Number
    },
    taskTemplateDescription: {
        type: String,
        required: true
    },
    taskTemplateSuggestedEvidence: {
        type: String
    }
},
    {
        timestamps: true
    });

TaskTemplateSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastTaskTemplate = await mongoose.model('TaskTemplate').findOne({ serviceType: this.serviceType }).sort('-taskTemplateOrdering');
        this.taskTemplateOrdering = lastTaskTemplate ? lastTaskTemplate.taskTemplateOrdering + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('TaskTemplate', TaskTemplateSchema);