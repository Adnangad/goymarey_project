import { get_users, get_user_by_id, create_user, check_user, delete_user, follow_smn, get_followers, get_following, unfollow_smn } from "./user_functions.js";
import { get_posts, create_post, update_post, delete_post, get_specific_post, get_user_posts, get_following_posts } from "./post_functions.js";
import { unlike_post, like_post, getLikes, liked_by } from "./like_functions.js";
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
    createUser: async ({ name, email, password, date_of_birth, gender, imageUrl }) => {
        try {
            return await create_user(name, email, password, date_of_birth, gender, imageUrl);
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
    },
    // Retrieves all Posts
    posts: async () => {
        return await get_posts();
    },
    //Gets all posts by a user
    postsByUser: async ({ user_id }) => {
        return await get_user_posts(user_id);
    },
    // gets a specific post by post id
    post: async ({ id }) => {
        return await get_specific_post(id);
    },
    // gets all posts of users that the current user follows
    postsByFollowing: async({ user_id }) => {
        return await get_following_posts(user_id);
    },
    // creates a post
    createPost: async ({ content, user_id }) => {
        return await create_post(content, user_id);
    },
    //updates a post
    updatePost: async ({ post_id, content }) => {
        return await update_post(post_id, content);
    },
    //deletes a post
    deletePost: async ({ post_id }) => {
        return await delete_post(post_id);
    },
    //gets number of likes of a post
    likeCount: async ({ post_id }) => {
        return await getLikes(post_id);
    },
    //likes a post
    like: async ({ post_id, user_id }) => {
        return await like_post(post_id, user_id);
    },
    //unlikes a post
    unlike: async ({ post_id, user_id }) => {
        return await unlike_post(post_id, user_id);
    },
    // Shows users who liked a post
    likedBy: async ({ post_id }) => {
        return await liked_by(post_id);
    }
}
export default root;