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
        /**
         * @todo Issue: if this function recieves a null value for any of the filter's elements,
         * it will simply not be included in the query. What the query should do is include it
         * as a null value for proper search results. The issue is that the function can't
         * distinguish between an actual null value and an improper input value.
         * ie. for filter.name, input of null (ok) and input of 5 (invalid, should be a string)
         * will both produce filter.name = null
         */
        climbers: async (_, { filter }) => {
            if(!filter) {
                return await Climber.find()
            }
            let filters = {}
            if (filter.name !== undefined) filters.name = filter.name
            if (filter.nickname !== undefined) filters.nickname = filter.nickname
            if (filter.country !== undefined) {
                const country = await Country.findOne({ name: filter.country })
                filters.country = country
            }
            return await Climber.find(filters)
        },
        climberByID: async (_, { ID }) => await Climber.findById(ID)
    },

    Mutation: {
        createClimber: async (_, { input: {name, nickname, dob, sex, country, description} }) => {
            const climberArgs = {
                name: name,
                nickname: nickname,
                country: country,
                sex: sex,
                description: description,
                addedAt: Date.now(),
                updatedAt: Date.now()
            }

            let foundCountry = null
            if (country){
                foundCountry = await Country.findById(country)
                if(!foundCountry) {
                    throw new Error('Country not found')
                }
            }

            const foundClimber = await Climber.findOne({ name: name })
            if (foundClimber) {
                throw new Error("A climber with this name already exists")
            }

            if(dob) {
                climberArgs.dob = Date.parse(dob)
            }

            const climber = new Climber(climberArgs)

            foundCountry?.climbers.push(climber)
            await foundCountry?.save()

            console.log("Added climber")
            
            return await climber.save()
        },
        deleteClimber: async (_, { ID }) => {
            const climber = await Climber.findById(ID)
            if(!climber){
                throw new Error("Climber not found")
            }

            /** @todo deal with deleting ascents */

            const country = await Country.findById(climber.country)
            if(country) {
                const index = country.climbers.indexOf(ID);
                if (index > -1) { // only splice array when item is found
                    country.climbers.splice(index, 1); // 2nd parameter means remove one item only
                    await country.save()
                    console.log("Deleted climber from country")
                }
                else {
                    throw new Error("Error removing climber from Country")
                }
            }
            const test = await Climber.deleteOne({ _id: ID })
            console.log(test)
            return test.acknowledged
        }
    }
}