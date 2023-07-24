const Climb = require('../../models/Climb')
const Crag = require('../../models/Crag')
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
        climb: async (_, {id}) => await Climb.findById(id),
        climbs: async () => await Climb.find()
    },

    Mutation: {
        async createClimb(_, { climbInput: {name, grade, crag, fa, description} }){
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
                    fa: fa,
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