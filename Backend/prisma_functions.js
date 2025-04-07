import { PrismaClient } from "@prisma/client";
import CustomError from "./custom_errors.js";

const prisma = new PrismaClient();

const get_users = async () => {
    const users = await prisma.user.findMany();
    return users;
}

const get_user_by_id = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        }
    });
    return user;
}
const create_user = async (name, email, password, date_of_birth, gender) => {
    try {
        const user = await prisma.user.create({
            data: {
                name, email, password, date_of_birth, gender
            }
        });
        return user;
    } catch(error) {
        throw CustomError("A user with the username/email already exists");
    }
}

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

const delete_user = async(email, password) => {
    try {
        const user = await check_user(email, password);
        if (user) {
            prisma.user.delete({
                where: {
                    id: user.id,
                }
            });
            return "Success";
        }
    } catch(error) {
        throw (error);
    }
}

export { get_users, get_user_by_id, create_user, check_user, delete_user };