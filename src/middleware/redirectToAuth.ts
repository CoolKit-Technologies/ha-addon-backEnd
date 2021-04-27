import url from 'url';
import { Request, Response, NextFunction } from 'express';
import { debugMode } from '../config/config';
import { HaRestURL } from '../config/url';

const genAuthorizeUrl = (hassUrl: string, clientId: string, redirectUrl: string, state?: string) => {
    let authorizeUrl = `${hassUrl}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(redirectUrl)}`;

    authorizeUrl += `&client_id=${encodeURIComponent(clientId)}`;

    if (state) {
        authorizeUrl += `&state=${encodeURIComponent(state)}`;
    }
    return authorizeUrl;
};

export default (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;
    console.log('Jia ~ file: redirectToAuth.ts ~ line 19 ~ code', code);
    const port = debugMode ? `:${8000}` : `:${3000}`;
    const clientId = req.headers.origin!;
    console.log('Jia ~ file: redirectToAuth.ts ~ line 22 ~ clientId', clientId);
    // todo
    if (clientId == 'http://localhost:8000' && code) {
        console.log(req.originalUrl);
        console.log(req.headers);

        // const clientId = req.protocol + '://' + req.hostname + port;
        // const redirectUri = clientId + req.url;
        res.json({
            error: 302,
            data: genAuthorizeUrl(HaRestURL, clientId, clientId),
        });
    } else {
        next();
    }
};
