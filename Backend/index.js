import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import root from "./paths.js";
import cors from "cors";

const schema = buildSchema(`
    scalar DateTime
    type MessageResponse {
        success: Boolean!
        message: String!
    }
    type PostCount {
        Like: Int!
    }

    type User {
        id: ID
        name: String
        email: String
        password: String
        date_of_birth: DateTime
        gender: String
        imageUrl: String
        followersCount: Int
        followingCount: Int
        posts: [Posts]
    }
    type Posts {
        id: ID!
        content: String!
        likes: Int!
        created_at: DateTime!
        updated_at: DateTime!
        edited: Boolean!
        user_id: Int
        user: User!
        _count: PostCount
    }
    type Like {
        id: ID
        liked: Boolean
        user_id: Int
        post_id: Int
    }
    type Query {
        users: [User]
        user(id: ID!): User
        login(email: String!, password: String!): User
        followers(user_id: ID!): [User]
        following(user_id: ID!): [User]
        posts: [Posts]
        postsByUser(user_id: ID!): [Posts]
        post(id: ID!): Posts
        postsByFollowing(user_id: ID!): [Posts]
        likeCount(post_id:ID): Int
        likedBy(post_id:ID): [User]
        
    }
    type Mutation {
        createUser(name:String, email:String, password:String, date_of_birth:DateTime, gender:String, imageUrl:String): User
        deleteUser(email:String, password:String): MessageResponse
        follow(user_id: ID!, follow_id: ID!): MessageResponse
        unfollow(user_id:ID!, unfollow_id: ID!): MessageResponse
        createPost(content:String, user_id: ID): Posts
        updatePost(post_id: ID, content: String): Posts
        updateUser(user_id: ID, name:String, imageUrl:String): User
        deletePost(post_id:ID): MessageResponse
        like(post_id:ID, user_id:ID): MessageResponse
        unlike(post_id:ID, user_id:ID): MessageResponse
    }
    `);

const app = express();
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://goymarey-project.vercel.app',
        'https://goymarey-project.onrender.com'
    ],
}));
app.use("/graphql", graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log("Server running at http://localhost:4000/graphql");
});