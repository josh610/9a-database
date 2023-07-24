const { model, Schema } = require('mongoose')

const countrySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    crags: [{
        type: Schema.Types.ObjectId,
        ref: 'Crag',
        required: false
    }],
    climbers: [{
        type: Schema.Types.ObjectId,
        ref: 'Climber',
        required: false
    }],
    description: {
        type: String,
        required: false
    }
})

module.exports = model('Country', countrySchema)