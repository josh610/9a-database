const { model, Schema } = require('mongoose')

const climberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    ascents: [{
        type: Schema.Types.ObjectId,
        ref: 'Ascent',
        required: true
    }],
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

module.exports = model('Climber', climberSchema)