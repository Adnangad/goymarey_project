import { PrismaClient } from "@prisma/client";
import CustomError from "./custom_errors.js";

const prisma = new PrismaClient();

// retreives all users from db
const get_users = async () => {
    const users = await prisma.user.findMany();
    return users;
}

// retreives specific user from db
const get_user_by_id = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            _count: {
                select: {
                    followedBy: true,
                    following: true,
                },
            },
        },
    });
    return {
        ...user,
        followersCount: user._count.following,
        followingCount: user._count.followedBy,
    };
}

//creates a user in the db
const create_user = async (name, email, password, date_of_birth, gender, imageUrl) => {
    try {
        const user = await prisma.user.create({
            data: {
                name, email, password, date_of_birth, gender, imageUrl
            }
        });
        return user;
    } catch (error) {
        console.log(error);
        throw new CustomError("A user with the username/email already exists");
    }
}

//checks if the user provided credentials are correct
const check_user = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.password !== password) {
        throw new Error("Invalid credentials");
    }

    return user;
}

//removes a user from the db
const delete_user = async (email, password) => {
    try {
        const user = await check_user(email, password);
        if (user) {
            await prisma.user.delete({
                where: {
                    id: parseInt(user.id),
                }
            });
            return "Success";
        }
    } catch (error) {
        throw (error);
    }
}

// Retreives a list of users who follow the provided user_id
const get_followers = async (user_id) => {
    try {
        const followers = await prisma.follows.findMany({
            where: { followingId: parseInt(user_id) },
            include: {
                followedBy: true,
            },
        });
        return followers.map(f => f.followedBy);
    } catch (error) {
        throw error;
    }
}

//Retreives a list of users who the provided user_id follows
const get_following = async (user_id) => {
    try {
        const followingz = await prisma.follows.findMany({
            where: { followedById: parseInt(user_id) },
            include: {
                following: true,
            },
        });
        return followingz.map(f => f.following);
    } catch (error) {
        throw error;
    }
}

// creates a follower
const follow_smn = async (user_id, follow_id) => {
    // user_id: the current user
    // follower_id: the id that the current user wants to follow
    try {
        const alreadyFollowing = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followedById: parseInt(user_id),
                    followingId: parseInt(follow_id),
                }
            }
        });

        if (alreadyFollowing) {
            return "Already following";
        }
        await prisma.follows.create({
            data: {
                followedById: parseInt(user_id),
                followingId: parseInt(follow_id)
            }
        });
        return "Success";
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// unfollows smn
const unfollow_smn = async (user_id, unfollow_id) => {
    try {
        const isFollowing = await prisma.follows.findUnique({
            where: {
                followingId_followedById: {
                    followedById: parseInt(user_id),
                    followingId: parseInt(unfollow_id),
                }
            }
        });
        if (isFollowing) {
            await prisma.follows.delete({
                where: {
                    followingId_followedById: {
                        followedById: parseInt(user_id),
                        followingId: parseInt(unfollow_id),
                    }
                }
            });
            return 'Success';
        }
        return "Not Following"
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export { get_users, get_user_by_id, create_user, check_user, delete_user, follow_smn, get_followers, get_following, unfollow_smn };