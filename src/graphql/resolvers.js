const { mergeResolvers } = require('@graphql-tools/merge')
const dateScalar = require('./DateScalar')

//const AscentResolvers = require('./ascent/resolvers')
//const ClimbResolvers = require('./climb/resolvers')

const ascentResolver = require('./resolvers/ascent')
const climbResolver = require('./resolvers/climb')
const climberResolver = require('./resolvers/climber')
const cragResolver = require('./resolvers/crag')
const countryResolver = require('./resolvers/country')

const dateResolver = {
    Date: dateScalar
}

const resolvers = [
    ascentResolver,
    climbResolver,
    climberResolver,
    cragResolver,
    countryResolver,
    dateResolver
]

module.exports = mergeResolvers(resolvers)