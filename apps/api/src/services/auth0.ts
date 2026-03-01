import { auth0Api } from "../lib/axios";
import { Auth0UserInfoResponse } from "./types";

export class Auth0Service {
    constructor() { }

    async getUserInfo(accessToken: string) {
        const { data } = await auth0Api.get<Auth0UserInfoResponse>("/userinfo", {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return data;
    }
}