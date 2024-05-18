import { Hono } from "hono";

export const moviesRoute = new Hono()
    .get('/', (c) => {
        return c.json({ 
            message: 'Success'
         })
    })