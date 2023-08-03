const { model, Schema } = require('mongoose')

const countrySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ISOcode: {
        type: String,
        required: true
    },
    crags: [{
        crag: {
            name: {
                type: String,
                required: true
            },
            data: {
                type: Schema.Types.ObjectId,
                ref: 'Crag',
                required: false
            }
        },
    }],
    climbers: [{
        name: {
            type: String,
            required: true
        },
        data: {
            type: Schema.Types.ObjectId,
            ref: 'Climber',
            required: true
        }
    }],
    description: {
        type: String,
        required: false
    }
})

module.exports = model('Country', countrySchema)