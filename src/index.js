const { ApolloServer } = require("apollo-server")
const mongoose = require("mongoose")

//const typeDefs = require('./graphql/schema/index')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const MONGODB = "mongodb+srv://joshz610657:e4FXAhhawwGBMFih@cluster0.r8vaaa1.mongodb.net/9a-branch-sort?retryWrites=true&w=majority"

const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log("MongoDB connection successful")
        return server.listen({port: 4000})
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    })