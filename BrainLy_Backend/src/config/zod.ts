import * as z from "zod";


// User SignUp & SignIn
const passwordSchema = z.string()
    .min(8, { message: "Password must have at least 8 characters" })
    .regex(/[A-Z]/, { message: "One uppercase character required" })
    .regex(/[a-z]/, { message: "One lowercase character required" })
    .regex(/[0-9]/, { message: "One number required" })
    .regex(/[^a-zA-Z0-9]/, { message: "One special character required" });


const usernameSchema = z.string()
    .trim()
    .min(4, { message: "Username must have at least 4 characters" })
    .max(16, { message: "Username can have maximum 16 characters" });


const emailSchema = z.string()
    .trim()
    .pipe(z.email({ message: "Invalid email address" }).toLowerCase());



// Content validation

const titleSchema = z.string({ message: 'Title expected string' })
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title can have maximum 100 characters" })


const linkSchema = z.string({ message: 'Link expected string' }).url({ message: "Invalid URL format" });

const tag = z.string({ message: 'tags expected string' })
    .trim()
    .min(1, { message: "Each tag must be at least 1 characters long" })
    .max(35, { message: "Each tag must be under 35 characters" })


const tagSchema = z.array(tag).optional().default([]);


export const ContentSchema = z.object({
    title: titleSchema,
    links: linkSchema,
    tags: tagSchema,
})

export const UserSignUpSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

export const UserSignInSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
