import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@jayantguru/medium-clone-common";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*', async (c, next) => {
    // authentication logic
    const authHeader = c.req.header('Authorization');

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        c.status(401);
        return c.json({error: "no/invalid authorization"})
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = await verify(token, c.env.JWT_SECRET);

        c.set('userId', decoded.id);
        await next();

    } catch (e) {
        c.status(401);
        return c.json({
            error: "You are not authorized"
        });
    }

})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: c.get('userId')
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const updatedBlog = await prisma.blog.update({
        where: {
            id: body.id,
            authorId: c.get('userId')
        },
        data: {
            title: body.title,
            content: body.content
        }
    })

    return c.text('Blog updated successfully');
})

// Add pagination here so that it returns the first 10 blogs
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    })

    return c.json(blogs);
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const id = c.req.param('id');

    const blog = await prisma.blog.findFirst({
        where: {
            id: id,
            authorId: c.get('userId')
        },
        select: {
            id: true,
            title: true,
            content: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    })

    return c.json(blog);
})

