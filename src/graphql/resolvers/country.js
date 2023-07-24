const Country = require('../../models/Country')
const Crag = require('../../models/Crag')
const Climber = require('../../models/Climber')

module.exports = {
    Country: {
        crags: async (parent) => {
            return await Crag.find({_id: {$in: parent.crags}})
        },
        climbers: async (parent) => {
            return await Climber.find({_id: {$in: parent.climbers}})
        }
    },
    Query: {
        country: async (_, {id}) => await Country.findById(id),
        countries: async () => await Country.find()
    }
}