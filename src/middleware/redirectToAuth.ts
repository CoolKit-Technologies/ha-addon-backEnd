import url from 'url';
import { Request, Response, NextFunction } from 'express';
import { debugMode } from '../config/config';
import { HaRestURL } from '../config/url';
import AuthClass from '../class/AuthClass';

const genAuthorizeUrl = (hassUrl: string, clientId: string, redirectUrl: string, state?: string) => {
    let authorizeUrl = `${hassUrl}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(redirectUrl)}`;

    authorizeUrl += `&client_id=${encodeURIComponent(clientId)}`;

    if (state) {
        authorizeUrl += `&state=${encodeURIComponent(state)}`;
    }
    return authorizeUrl;
};

export default async (req: Request, res: Response, next: NextFunction) => {
    const {
        url,
        hostname,
        protocol,
        query: { code },
        headers: { origin, host },
        ip,
    } = req;
    console.log('Jia ~ file: redirectToAuth.ts ~ line 27 ~ ip', ip);
    const port = debugMode ? `:${8000}` : `:${3000}`;
    const clientId = protocol + '://' + hostname + port;

    // if (origin === 'http://localhost:8000') {
    if (AuthClass.isValid(ip)) {
        next();
    } else {
        if (url === '/' || url.indexOf('/?code') === 0) {
            next();
        } else {
            console.log('Jia ~ file: redirectToAuth.ts ~ line 40 ~ url', url);
            res.json({
                error: 302,
                data: HaRestURL,
            });
        }
    }
    // } else {
    //     next();
    // }
};
