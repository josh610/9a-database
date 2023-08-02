const Climb = require('../../models/Climb')
const Crag = require('../../models/Crag')
const Ascent = require('../../models/Ascent')

module.exports = {
    Climb: {
        ascents: async (parent) => {
            return await Ascent.find({_id: {$in: parent.ascents}})
        },
        crag: async (parent) => {
            return await Crag.findOne({_id: parent.crag._id})
        }
    },
    Query: {
        climbs: async (_, { filter, limit }) => {
            if(!filter) {
                return await Climb.find().limit(limit)
            }
            let filters = {}
            if (filter.name !== undefined) filters.name = filter.name
            if (filter.crag !== undefined) filters.crag = filter.crag
            /** @todo country filter **/

            return await Climb.find(filters).limit(limit)
        },
        climb: async (_, { ID }) => await Climb.findById(ID)
    },

    Mutation: {
        createClimb: async (_, { input: {name, grade, crag, description} }) => {
            let foundCrag = null
            if (crag){
                foundCrag = await Crag.findById(crag)
                if(!foundCrag) {
                    throw new Error('Crag not found')
                }
            }

            const foundClimb = await Climb.findOne({ name: name })
            if (foundClimb) {
                throw new Error("A climb with this name already exists (" + foundClimb._id + ")")
            }

            const climb = new Climb({
                name: name,
                grade: grade,
                crag: crag,
                description: description,
                addedAt: Date.now(),
                updatedAt: Date.now()
            })

            foundCrag.climbs.push(climb)
            await foundCrag.save()
            
            return await climb.save()
        },
        deleteClimb: async (_, { ID }) => {
            const climb = await Climb.findById(ID)
            if(!climb){
                throw new Error("Climb not found")
            }

            const ascents = await Ascent.find({ climb: climb._id })
            ascents.forEach(async ascent => {
                const climber = ascent.climber
                const ascentIndex = climber.ascents.indexOf(ascent._id);
                if (ascentIndex > -1) { // only splice array when item is found
                    climber.ascents.splice(ascentIndex, 1); // 2nd parameter means remove one item only
                    await climber.save()
                }
                else {
                    throw new Error("Error removing ascent from Climber")
                }

                const faIndex = climber.fas.indexOf(ascent._id);
                if (faIndex > -1) { // only splice array when item is found
                    climber.fas.splice(faIndex, 1); // 2nd parameter means remove one item only
                    await climber.save()
                }

                /** @todo maybe include error checking for this */
                const res = (await Ascent.deleteOne({ _id: ascent._id })).acknowledged
                if(!res){
                    throw new Error("Error deleting ascent (" + ascent._id + ")")
                }
            })
            
            const crag = await Crag.findById(climb.crag)
            if(crag) {
                const index = crag.climbs.indexOf(ID);
                if (index > -1) { // only splice array when item is found
                    crag.climbs.splice(index, 1); // 2nd parameter means remove one item only
                    await crag.save()
                    //console.log("Deleted climb from crag")
                }
                else {
                    throw new Error("Error removing climber from Country")
                }
            }
            const res = await Climb.deleteOne({ _id: ID })
            //console.log(res)
            return res.acknowledged
        }
    }
}