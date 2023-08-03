const { model, Schema } = require('mongoose')

const cragSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: false
    },
    climbs: [{
        name: {
            type: String,
            required: true
        },
        data: {
            type: Schema.Types.ObjectId,
            ref: 'Climb',
            required: true
        }
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

module.exports = model('Crag', cragSchema)