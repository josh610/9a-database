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
        ascentById: async (_, { ID }) => await Ascent.findById(ID),
        ascents: async () => await Ascent.find()
    },

    Mutation: {
        createAscent: async (_, { ascentInput: {climber, climb, gradeProposal, fa, flash, onsight, date, links, description} }) => {
            try{
                const foundClimb = await Climb.findById(climb)
                if(!foundClimb){
                    throw new Error("Climb not found")
                }
                const foundClimber = await Climber.findById(climber)
                if(!foundClimber){
                    throw new Error("Climber not found")
                }

                const ascent = new Ascent({
                    climber: climber,
                    climb: climb,
                    gradeProposal: gradeProposal,
                    fa: fa,
                    flash: flash,
                    onsight: onsight,
                    date: Date.parse(date),
                    links: links,
                    description: description,
                    addedAt: Date.now(),
                    updatedAt: Date.now()
                })

                foundClimb.ascents.push(ascent)
                await foundClimb.save()
                foundClimber.ascents.push(ascent)
                await foundClimber.save()
                if(fa){
                    foundClimb.fa.push(foundClimber.name)
                }

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
        deleteAscent: async (_, {id}) => {
            return (await Ascent.deleteOne({_id: id})).deletedCount
        }
    }
}