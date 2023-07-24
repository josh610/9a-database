const { gql } = require('apollo-server')
const fs = require('fs')

function loadSchema (file) {
    return gql(fs.readFileSync(`src/graphql/schema/${file}`).toString())
}

const AscentTypeDef = loadSchema('ascent.gql')
const ClimbTypeDef = loadSchema('climb.gql')
const ClimberTypeDef = loadSchema('climber.gql')
const CragTypeDef = loadSchema('crag.gql')
const CountryTypeDef = loadSchema('country.gql')

const DateTypeDef = gql`
    scalar Date
    #scalar Grade
`

const typeDefs = [
    AscentTypeDef,
    ClimbTypeDef,
    ClimberTypeDef,
    CragTypeDef,
    CountryTypeDef,
    DateTypeDef
]

module.exports = typeDefs