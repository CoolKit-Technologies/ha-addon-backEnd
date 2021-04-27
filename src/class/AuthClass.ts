import { getDataSync } from '../utils/dataUtil';

type TypeToken = {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    expires_time: number;
};

export default class AuthClass {
    static AuthMap: Map<string, TypeToken> = new Map();

    constructor() {
        this.init();
    }

    init() {
        const auths = getDataSync('auth.json') || {};
        for (let url in auths) {
            const auth = auths[url] as TypeToken;
            if (auth) {
                const now = Date.now();
                if (now < auth.expires_time) {
                    AuthClass.AuthMap.set(url, auth);
                }
            }
        }
    }

    getAuth(url: string) {}
}
