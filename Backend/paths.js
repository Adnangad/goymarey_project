import { get_users, get_user_by_id, create_user, check_user, delete_user } from "./prisma_functions.js";
import { GraphQLError } from "graphql";

let users = [];
const root = {
    users: async () => {
        users = await get_users();
        return await get_users();
    },
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
    }
}
export default root;