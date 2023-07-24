const Crag = require('../../models/Crag')
const Climb = require('../../models/Climb')
const Country = require('../../models/Country')

module.exports = {
    Crag: {
        climbs: async (parent) => {
            return await Climb.find({_id: {$in: parent.climbs}})
        },
        country: async (parent) => {
            return await Country.findOne({_id: {$in: parent.country}})
        }
    },
    Query: {
        crag: async (_, {id}) => await Crag.findById(id),
        crags: async () => await Crag.find()
    },

    Mutation: {
        async createCrag(_, { cragInput: {name, countryId, description} }){
            try{
                const foundCountry = await Country.findById(countryId)
                if (!foundCountry){
                    throw new Error("Country not found")
                }
                const foundCrag = await Crag.findOne({ name: name })
                if (foundCrag) {
                    throw new Error("A crag with this name already exists")
                }

                const crag = new Crag({
                    name: name,
                    country: countryId,
                    description: description,
                    addedAt: Date.now(),
                    updatedAt: Date.now()
                })

                foundCountry.crags.push(crag)
                await foundCountry.save()
                
                return await crag.save()
            } catch (err) {
                throw err
            }
        }
    }
}