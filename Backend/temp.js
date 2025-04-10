import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
await prisma.user.updateMany({
    where: {
        imageUrl: null,
    },
    data: {
        imageUrl: "https://res.cloudinary.com/dmqmqd2m9/image/upload/v1744253630/bydyzdlicmawen3u32cn.jpg",
    }
});
