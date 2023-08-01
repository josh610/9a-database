const Ascent = require('../../models/Ascent')
const Climb = require('../../models/Climb')
const Climber = require('../../models/Climber')


module.exports = {
    Ascent: {
        climb: async (parent) => {
            return await Climb.findOne({_id: {$in: parent.climb}})
        },
        climber: async (parent) => {
            return await Climber.findOne({_id: {$in: parent.climber}})
        }
    },
    Query: {
        ascentByID: async (_, { ID }) => await Ascent.findById(ID),
        ascents: async (_, { filter }) => {
            if(!filter) {
                return await Ascent.find()
            }
            let filters = {}
            if (filter.climber !== undefined) {
                const climber = await Climber.findOne({ name: filter.climber })
                filters.climber = climber
            }
            if (filter.climb !== undefined) {
                const climb = await Climb.findOne({ name: filter.climb })
                filters.climb = climb
            }
            return await Ascent.find(filters)
        }
    },

    Mutation: {
        createAscent: async (_, { input: {climber, climb, gradeProposal, fa, flash, onsight, date, links, description} }) => {
            try{
                const ascentArgs = {
                    climber: climber,
                    climb: climb,
                    gradeProposal: gradeProposal,
                    fa: fa,
                    flash: flash,
                    onsight: onsight,
                    links: links,
                    description: description,
                    addedAt: Date.now(),
                    updatedAt: Date.now()
                }

                const foundClimb = await Climb.findById(climb)
                if(!foundClimb){
                    throw new Error("Climb not found")
                }
                const foundClimber = await Climber.findById(climber)
                if(!foundClimber){
                    throw new Error("Climber not found")
                }
                if(await Ascent.findOne({ climber: foundClimber, climb: foundClimb })){
                    throw new Error("An ascent with this climber and climb already exists (" + foundClimber._id + ", " + foundClimb._id + ")")
                }

                if(date) {
                    ascentArgs.date = Date.parse(date)
                }

                const ascent = new Ascent(ascentArgs)

                foundClimb.ascents.push(ascent)
                if(fa){
                    foundClimb.fa = ascent
                }
                await foundClimb.save()

                foundClimber.ascents.push(ascent)
                if(fa) {
                    foundClimber.fas.push(ascent)
                }
                await foundClimber.save()

                return await ascent.save()
            } catch (err) {
                throw err
            }
        },
        updateAscent: async (_, {id}, { ascentInput: {climber, climb, gradeProposal, fa, date, links, description} }) => {
            const foundClimb = await Climb.findById(climb)
            if(!foundClimb){
                throw new Error("Climb not found")
            }
            const foundClimber = await Climber.findById(climber)
            if(!foundClimber){
                throw new Error("Climber not found")
            }

            
            return (await Ascent.updateOne({_id: id})).acknowledged
        },
        deleteAscent: async (_, { ID }) => {
            const ascent = await Ascent.findById(ID)
            if(!ascent){
                throw new Error("Ascent not found")
            }

            const climber = await Climber.findById(ascent.climber)
            if(climber) {
                const ascentIndex = climber.ascents.indexOf(ID);
                if (ascentIndex > -1) { // only splice array when item is found
                    climber.ascents.splice(ascentIndex, 1); // 2nd parameter means remove one item only
                    await climber.save()
                }
                else {
                    throw new Error("Error removing ascent from Climber")
                }

                const faIndex = climber.fas.indexOf(ID);
                if (faIndex > -1) { // only splice array when item is found
                    climber.fas.splice(faIndex, 1); // 2nd parameter means remove one item only
                    await climber.save()
                }
            }
            
            const climb = await Climb.findById(ascent.climb)
            if(climb) {
                const index = climb.ascents.indexOf(ID);
                if (index > -1) { // only splice array when item is found
                    climb.ascents.splice(index, 1); // 2nd parameter means remove one item only
                    await climb.save()
                }
                else {
                    throw new Error("Error removing ascent from Climb")
                }
            }

            const res = await Ascent.deleteOne({ _id: ID })
            //console.log(res)
            return res.acknowledged
        }
    }
}