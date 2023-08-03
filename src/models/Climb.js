const { model, Schema } = require('mongoose')

const climbSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    ascents: [{
        climber: {
            name: {
                type: String,
                required: true
            },
            country: {
                name: {
                    type: String,
                    required: true
                },
                data: {
                    type: Schema.Types.ObjectId,
                    ref: 'Country',
                    required: true
                }
            },
            data: {
                type: Schema.Types.ObjectId,
                ref: 'Climber',
                required: true
            }
        },
        data: {
            type: Schema.Types.ObjectId,
            ref: 'Ascent',
            required: false
        }
    }],
    crag: {
        name: {
            type: String,
            required: true
        },
        country: {
            name: {
                type: String,
                required: true
            },
            data: {
                type: Schema.Types.ObjectId,
                ref: 'Country',
                required: true
            }
        },
        data: {
            type: Schema.Types.ObjectId,
            ref: 'Crag',
            required: false
        }
    },
    fa: {
        type: Schema.Types.ObjectId,
        ref: 'FA',
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

module.exports = model('Climb', climbSchema)