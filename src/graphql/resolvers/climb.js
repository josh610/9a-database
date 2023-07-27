const Climb = require('../../models/Climb')
const Crag = require('../../models/Crag')
const Country = require('../../models/Country')
const Ascent = require('../../models/Ascent')

module.exports = {
    Climb: {
        ascents: async (parent) => {
            return await Ascent.find({_id: {$in: parent.ascents}})
        },
        crag: async (parent) => {
            return await Crag.findOne({_id: {$in: parent.crag}})
        }
    },
    Query: {
        climbs: async (_, { filter }) => {
            if(!filter) {
                return await Climb.find()
            }
            let filters = {}
            if (filter.name !== undefined) filters.name = filter.name
            if (filter.crag !== undefined) {
                const crag = await Crag.findOne({ name: filter.crag })
                filters.crag = crag
            }
            /** @todo country filter **/

            return await Climb.find(filters)
        },
        climbById: async (_, { ID }) => await Climb.findById(ID)
    },

    Mutation: {
        async createClimb(_, { input: {name, grade, crag, description} }){
            try{
                const foundCrag = await Crag.findById(crag)
                if(!foundCrag) {
                    throw new Error("Crag does not exist")
                }
                const foundClimb = await Climb.findOne({ name: name })
                if (foundClimb) {
                    throw new Error("A climb with this name already exists")
                }

                const climb = new Climb({
                    name: name,
                    grade: grade,
                    crag: crag,
                    //fa: fa,
                    description: description,
                    addedAt: Date.now(),
                    updatedAt: Date.now()
                })

                foundCrag.climbs.push(climb)
                await foundCrag.save()
                
                return await climb.save()
            } catch (err) {
                throw err
            }
        }
    }
}