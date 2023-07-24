const Climber = require('../../models/Climber')
const Country = require('../../models/Country')
const Ascent = require('../../models/Ascent')

module.exports = {
    Climber: {
        ascents: async (parent) => {
            return await Ascent.find({_id: {$in: parent.ascents}})
        },
        country: async (parent) => {
            return await Country.findOne({_id: {$in: parent.country}})
        }
    },
    Query: {
        climber: async (_, {id}) => await Climber.findById(id),
        climbers: async () => await Climber.find()
    },

    Mutation: {
        async createClimber(_, { climberInput: {name, dob, country, description} }){
            try{
                const foundCountry = await Country.findById(country)
                if(!foundCountry) {
                    throw new Error('Country not found')
                }
                const foundClimber = await Climber.findOne({ name: name })
                if (foundClimber) {
                    throw new Error("A climber with this name already exists")
                }

                const climber = new Climber({
                    name: name,
                    dob: Date.parse(dob),
                    country: country,
                    description: description,
                    addedAt: Date.now(),
                    updatedAt: Date.now()
                })

                foundCountry.climbers.push(climber)
                await foundCountry.save()
                
                return await climber.save()
            } catch (err) {
                throw err
            }
        }
    }
}