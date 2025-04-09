import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import CustomError from "./custom_errors.js";

const prisma = new PrismaClient();

// gets a comments likes
const getLikes = async (post_id) => {
    try {
        const count = await prisma.like.count({
            where: {
                post_id: parseInt(post_id),
                liked: true
            },
        });
        return count;
    } catch (error) {
        console.log("error");
        throw new GraphQLError(`${error}`, {
            extensions: {
                code: "UNABLE_TO_GET_POSTS",
                http: { status: 500 }
            }
        });
    }
}

// Likes a comment
const like_post = async (post_id, user_id) => {
    try {
        await prisma.like.upsert({
            where: {
                user_id_post_id: {
                    user_id: parseInt(user_id),
                    post_id: parseInt(post_id),
                }
            },
            update: {
                liked: true
            },
            create: {
                user_id: parseInt(user_id),
                post_id: parseInt(post_id),
                liked: true
            }
        });
        await prisma.posts.update({
            where: {
                id: parseInt(post_id),
            },
            data: {
                likes: {
                    increment: 1
                }
            }
        })
        return {
            success: true,
            message: "Successfully liked the post"
        }
    } catch (error) {
        console.log("error");
        throw new GraphQLError(`${error}`, {
            extensions: {
                code: "UNABLE_TO_GET_POSTS",
                http: { status: 500 }
            }
        });
    }
}

//unlikes a post
const unlike_post = async (post_id, user_id) => {
    try {
        await prisma.like.update({
            where: {
                user_id_post_id: {
                    user_id: parseInt(user_id),
                    post_id: parseInt(post_id),
                }
            },
            data: {
                liked: false
            },
        });
        return {
            success: true,
            message: "Successfully unliked the post"
        }
    } catch (error) {
        console.log("error");
        throw new GraphQLError(`${error}`, {
            extensions: {
                code: "UNABLE_TO_GET_POSTS",
                http: { status: 500 }
            }
        });
    }
}

// retreives users that liked a post
const liked_by = async (post_id) => {
    try {
        const likez = await prisma.like.findMany({
            where: {
                post_id: parseInt(post_id),
                liked: true,
            },
            select: {
                user_id: true,
            }
        });
        const userIds = likez.map(l => l.user_id);
        const users = await prisma.user.findMany({
            where: {
                id: { in: userIds }
            }
        });
        return users;
    } catch (error) {
        console.log("error");
        throw new GraphQLError(`${error}`, {
            extensions: {
                code: "UNABLE_TO_GET_POSTS",
                http: { status: 500 }
            }
        });
    }
}

export { like_post, getLikes, unlike_post, liked_by }