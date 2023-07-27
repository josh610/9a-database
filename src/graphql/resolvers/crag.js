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
        cragById: async (_, { ID }) => await Crag.findById(ID),
        cragByName: async (_, { name }) => await Crag.find({name: name}),
        crags: async () => await Crag.find()
    },

    Mutation: {
        async createCrag(_, { cragInput: {name, country, description} }){
            const foundCountry = await Country.findById(country)
            if (!foundCountry){
                throw new Error("Country not found")
            }
            const foundCrag = await Crag.findOne({ name: name })
            if (foundCrag) {
                throw new Error("A crag with this name already exists")
            }

            const crag = new Crag({
                name: name,
                country: country,
                description: description,
                addedAt: Date.now(),
                updatedAt: Date.now()
            })

            foundCountry.crags.push(crag)
            await foundCountry.save()
            
            return await crag.save()
        },
        deleteCrag: async (_, { ID }) => {
            const crag = await Crag.findById(ID)
            if(!crag){
                throw new Error("Crag not found")
            }

            const country = await Country.findById(crag.country)
            if(country) {
                const index = country.crags.indexOf(ID);
                if (index > -1) { // only splice array when item is found
                    country.crags.splice(index, 1); // 2nd parameter means remove one item only
                    await country.save()
                }
                else {
                    throw new Error("Error removing crag from Country")
                }
            }

            /** @todo make sure this works lol */
            await Climb.updateMany({ crag: ID }, { $unset: { crag: "" } })

            return await Crag.deleteOne({ _id: ID }).acknowledged
        }
    }
}