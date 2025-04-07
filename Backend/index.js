import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import root from "./paths.js";

const schema = buildSchema(`
    scalar DateTime
    type DeleteResponse {
        success: Boolean!
        message: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        date_of_birth: DateTime!
        gender: String!
    }
    type Query {
        users: [User]
        user(id: ID!): User
        login(email: String!, password: String!): User
    }
    type Mutation {
        createUser(name:String, email:String, password:String, date_of_birth:DateTime, gender:String): User
        deleteUser(email:String, password:String): DeleteResponse
    }
    `);

const app = express();
app.use("/graphql", graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log("Server running at http://localhost:4000/graphql");
});