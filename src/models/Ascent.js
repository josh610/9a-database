const { model, Schema } = require('mongoose')

const ascentSchema = new Schema({
    climber: {
        type: Schema.Types.ObjectId,
        ref: 'Climber',
        required: true
    },
    climb: {
        type: Schema.Types.ObjectId,
        ref: 'Climb',
        required: true
    },
    gradeProposal: {
        type: String,
        required: false
    },
    fa: {
        type: Boolean,
        required: false
    },
    flash: {
        type: Boolean,
        required: false
    },
    onsight: {
        type: Boolean,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    links: {
        type: [String],
        required: false
    },
    description: {
        type: String,
        required: false
    },
    addedAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    }
})

module.exports = model('Ascent', ascentSchema)