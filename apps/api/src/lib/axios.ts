import { create } from "axios";

export const auth0Api = create({
    baseURL: `https://${process.env.AUTH0_DOMAIN}`,
})