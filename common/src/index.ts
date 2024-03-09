import z from 'zod'

// ****Signup Schema
export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})
// type inference
export type SignupInput = z.infer<typeof signupInput>


// ****Signin Schema
export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6)
})

export type SigninInput = z.infer<typeof signinInput>

// ****Blog creation schema
export const createBlogInput = z.object({
    title: z.string(),
    content: z.string()
})

export type CreateBlogInput = z.infer<typeof createBlogInput>

// ****Blog updation schema
export const updateBlogInput = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string()
})

export type UpdateBlogInput = z.infer<typeof updateBlogInput>

