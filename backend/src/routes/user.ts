import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from "@jayantguru/medium-clone-common";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(body.password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        // Converting the hash into hash string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedHexPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: hashedHexPassword,
                name: body.name
            }
        })

        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({
            message: "Signup Successfull",
            token: token
        });
    } catch (e) {
        c.status(403);
        return c.json({
            error: "Error while signing up"
        })
    }
})

userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())


    const encoder = new TextEncoder();
    const data = encoder.encode(body.password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Converting the hash into hash string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedHexPassword = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

    const user = await prisma.user.findFirst({
        where: {
            email: body.email,
            password: hashedHexPassword,
        }
    });

    if (!user) {
        c.status(403);
        return c.json({
            error: "Incorrect Credentials"
        });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
        message: "Signin Successfull",
        token: token
    });
})

