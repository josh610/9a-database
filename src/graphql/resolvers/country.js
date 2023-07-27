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
        country: async (_, { ID }) => await Country.findById(ID),
        countryByName: async (_, { name }) => await Country.findOne({ name: name }),
        countries: async () => await Country.find()
    }
}