import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import CustomError from "./custom_errors.js";

const prisma = new PrismaClient();

//retreives all posts
const get_posts = async () => {
    try {
        const posts = await prisma.posts.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        imageUrl: true,
                    }
                },
                _count: {
                    select: {
                        Like: true,
                    }
                }
            },
            orderBy: {
                created_at: 'desc',
            }
        });
        return posts.map(post => ({
            ...post,
            likes: post._count.Like
        }));
    } catch (error) {
        throw new GraphQLError(`${error}`, {
            extensions: {
                code: "UNABLE_TO_GET_POSTS",
                http: { status: 500 }
            }
        })
    }
}

// gets all posts from a specfic user
const get_user_posts = async (user_id) => {
    try {
        const user = prisma.user.findUnique({
            where: {
                id: parseInt(user_id),
            }
        });
        if (user) {
            const posts = await prisma.posts.findMany({
                where: {
                    user_id: parseInt(user_id),
                }
            });
            return posts;
        }
        else {
            const er = new CustomError("User not found");
            throw new GraphQLError(`${er}`, {
                extensions: {
                    code: "UNABLE_TO_GET_POSTS",
                    http: { status: 403 }
                }
            })
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

//retreives a specific post based on id
const get_specific_post = async (post_id) => {
    try {
        const post = prisma.posts.findFirst({
            where: {
                id: parseInt(post_id),
            }
        });
        return post;
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


// creates a post
const create_post = async (content, user_id) => {
    try {
        const user = prisma.user.findUnique({
            where: {
                id: parseInt(user_id),
            }
        });
        if (user) {
            const post = await prisma.posts.create({
                data: {
                    user_id: parseInt(user_id),
                    content: content,
                }
            });
            return post;
        }
        else {
            const er = new CustomError("User not found");
            throw new GraphQLError(`${er}`, {
                extensions: {
                    code: "UNABLE_TO_GET_POSTS",
                    http: { status: 403 }
                }
            })
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

// updates a post
const update_post = async (post_id, content) => {
    try {
        const post = prisma.posts.findUnique({
            where: {
                id: parseInt(post_id),
            }
        });
        if (post) {
            const post = await prisma.posts.update({
                where: {
                    id: parseInt(post_id),
                },
                data: {
                    content: content,
                    edited: true
                }
            });
            return post;
        }
        else {
            const er = new CustomError("User not found");
            throw new GraphQLError(`${er}`, {
                extensions: {
                    code: "UNABLE_TO_UPDATE_POSTS",
                    http: { status: 403 }
                }
            })
        }
    } catch (error) {
        console.log("error");
        throw new GraphQLError(`${error}`, {
            extensions: {
                code: "UNABLE_TO_UPDATE_POSTS",
                http: { status: 500 }
            }
        });
    }
}

const delete_post = async (post_id) => {
    try {
        const post_exists = await prisma.posts.findUnique({
            where: {
                id: parseInt(post_id),
            }
        });
        if (post_exists) {
            await prisma.posts.delete({
                where: {
                    id: parseInt(post_id)
                }
            });
            return {
                success: true,
                message: "Success"
            }
        }
        return {
            success: false,
            message: "No such post exists",
        }
    } catch (error) {
        console.log("error");
        throw new GraphQLError(`${error}`, {
            extensions: {
                code: "UNABLE_TO_UPDATE_POSTS",
                http: { status: 500 }
            }
        });
    }
}

//get posts from people the user is following
const get_following_posts = async (user_id) => {
    try {
        const user = prisma.user.findUnique({
            where: {
                id: parseInt(user_id),
            }
        });
        if (user) {
            const followingz = await prisma.follows.findMany({
                where: { followedById: parseInt(user_id) },
                include: {
                    following: true,
                },
            });
            const following = followingz.map(f => f.following);
            const posts = await prisma.posts.findMany({
                where: {
                    user_id: { in: following.map(f => f.id) },
                }, include: {
                    user: true,
                    _count: {
                        select: {
                            Like: true,
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc',
                }
            });
            return posts.map(post => ({
                ...post,
                likes: post._count.Like
            }));;
        }
        else {
            const er = new CustomError("User not found");
            throw new GraphQLError(`${er}`, {
                extensions: {
                    code: "UNABLE_TO_GET_POSTS",
                    http: { status: 403 }
                }
            })
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


export { get_posts, create_post, update_post, delete_post, get_user_posts, get_specific_post, get_following_posts }