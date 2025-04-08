import { get_users, get_user_by_id, create_user, check_user, delete_user, follow_smn, get_followers, get_following, unfollow_smn } from "./prisma_functions.js";
import { GraphQLError } from "graphql";


const root = {
    // gets all users
    users: async () => {
        const users = await get_users();
        return await get_users();
    },
    // gets a specific user based on id
    user: async ({ id }) => {
        const usr = await get_user_by_id(id);
        if (!usr) {
            throw new GraphQLError("User not found", {
                extensions: {
                    code: "USER_NOT_FOUND",
                    http: { status: 404 }
                }
            })
        }
        return usr;
    },
    // creates a user
    createUser: async ({ name, email, password, date_of_birth, gender }) => {
        try {
            return await create_user(name, email, password, date_of_birth, gender);
        } catch (error) {
            throw new GraphQLError(`${error}`, {
                extensions: {
                    code: "UNABLE_TO_CREATE_USER",
                    http: { status: 500 }
                }
            })
        }
    },
    // logs in a user
    login: async ({ email, password }) => {
        try {
            const user = await check_user(email, password);
            return user;
        } catch (error) {
            throw new GraphQLError(`${error}`, {
                extensions: {
                    code: "USER_NOT_FOUND",
                    http: { status: 500 }
                }
            })
        }
    },
    // deletes a user
    deleteUser: async ({ email, password }) => {
        try {
            const rez = await delete_user(email, password);
            if (rez === "Success") {
                return {
                    success: true,
                    message: "User deleted successfully"
                };
            }
            else {
                return {
                    success: false,
                    message: "User could not be deleted"
                };
            }
        } catch (error) {
            throw new GraphQLError(`${error}`, {
                extensions: {
                    code: "UNABLE_TO_DELETE_USER",
                    http: { status: 500 }
                }
            });
        }
    },
    // retreives a users followers
    followers: async ({ user_id }) => {
        try {
            const followerz = get_followers(user_id);
            return followerz;
        } catch (error) {
            throw new GraphQLError(`${error}`, {
                extensions: {
                    code: "UNABLE_TO_FETCH_FOLLOWERS",
                    http: { status: 500 }
                }
            });
        }
    },
    // retreives a users following
    following: async ({ user_id }) => {
        try {
            const following = get_following(user_id);
            return following;
        } catch (error) {
            throw new GraphQLError(`${error}`, {
                extensions: {
                    code: "UNABLE_TO_FETCH_FOLLOWING",
                    http: { status: 500 }
                }
            });
        }
    },
    // creates a following
    follow: async ({ user_id, follow_id }) => {
        try {
            const rez = await follow_smn(user_id, follow_id);
            return {
                success: rez === "Success",
                message: rez
            };
        } catch (error) {
            throw new GraphQLError(`${error}`, {
                extensions: {
                    code: "UNABLE_TO_FOLLOW_USER",
                    http: { status: 500 }
                }
            });
        }
    },
    // unfollows a user
    unfollow: async ({ user_id, unfollow_id }) => {
        try {
            const rez = await unfollow_smn(user_id, unfollow_id);
            return {
                success: rez === "Success",
                message: rez
            };
        } catch (error) {
            throw new GraphQLError(`${error}`, {
                extensions: {
                    code: "UNABLE_TO_UNFOLLOW_USER",
                    http: { status: 500 }
                }
            });
        }
    }
}
export default root;