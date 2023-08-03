const { model, Schema } = require('mongoose')

const ascentSchema = new Schema({
    climber: {
        name: {
            type: String,
            required: true
        },
        data: {
            type: Schema.Types.ObjectId,
            ref: 'Climber',
            required: true
        }
    },
    climb: {
        name: {
            type: String,
            required: true
        },
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
                required: true
            }
        },
        data: {
            type: Schema.Types.ObjectId,
            ref: 'Climb',
            required: true
        }
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