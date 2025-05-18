import { randomBytes } from 'node:crypto';

import createError from 'http-errors';
import type { CookieOptions, NextFunction, Request, Response } from 'express';

interface Options {
    /**
     * Token length in bytes
     * Default: 24
     */
    length?: number;

    /**
     * Function to get token from request
     * Default: headers['x-csrf-token'] || body._csrf_token || query._csrf_token
     */
    value?: (req: Request) => string | undefined;

    /**
     * Cookie name
     * Default: _csrf_token
     */
    name?: string;

    /**
     * Cookie options, see express res.cookie() documentation.
     * Default: { httpOnly: false, path: '/' }
     */
    cookie?: CookieOptions;
}

// Simple middleware for "Naive Double-Submit Cookie Pattern" CSRF protection method.
// @see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#naive-double-submit-cookie-pattern-discouraged
export const createMiddleware = (_options?: Options) => {
    const options: Required<Options> = {
        length: 24,
        value: defaultValue,
        name: '_csrf_token',
        ..._options,
        cookie: {
            httpOnly: false,
            path: '/',
            ..._options?.cookie,
        },
    };

    const isValidCsrfToken = (req: Request) => {
        const cookieToken = req.cookies[options.name];
        const requestToken = options.value(req);

        return Boolean(requestToken && cookieToken && cookieToken === requestToken);
    };

    const middleware = (req: Request, res: Response, next: NextFunction) => {
        if (!req.cookies[options.name]) {
            const csrfToken = randomBytes(options.length).toString('hex');
            req.cookies[options.name] = csrfToken;
            res.cookie(options.name, csrfToken, options.cookie);
        }

        next();
    };

    middleware.validate = (req: Request, res: Response, next: NextFunction) => {
        if (!isValidCsrfToken(req)) {
            throw createError(403, 'Invalid CSRF token', { code: 'EBADCSRFTOKEN' });
        }

        next();
    };

    return middleware;
};

function defaultValue (req: Request): string {
    return req.headers['x-csrf-token'] ||
        (req.body && req.body._csrf_token) ||
        (req.query && req.query._csrf_token);
}
