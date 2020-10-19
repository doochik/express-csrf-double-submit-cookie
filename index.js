'use strict';

const createError = require('http-errors');
const crypto = require('crypto');

const DEFAULT_OPTIONS = {
    length: 24,
    value: defaultValue,
};

const DEFAULT_COOKIE_OPTIONS = {
    httpOnly: false,
    name: '_csrf_token',
    path: '/',
};

/**
 * Simple middleware for "double submit cookie" CSRF protection method.
 * @see https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Double_Submit_Cookie
 *
 * @param {object} options
 * @param {number} [options.length=24] Token length in bytes.
 * @param {function} [options.value=24] Function to get token from request (defaults: body._csrf_token || query._csrf_token || headers['x-csrf-token'])
 * @param {cookie} [options.cookie] Cookie options, see express res.cookie() documentation. Default: { name: '_csrf_token', path: '/' }
 */
module.exports = (options = {}) => {
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    const cookieOptions = Object.assign({}, DEFAULT_COOKIE_OPTIONS, options.cookie);

    const middleware = (req, res, next) => {
        if (!req.cookies[cookieOptions.name]) {
            const csrfToken = crypto.randomBytes(options.length).toString('hex');
            req.cookies[cookieOptions.name] = csrfToken;
            res.cookie(cookieOptions.name, csrfToken, cookieOptions);
        }

        req.isValidCsrfToken = () => {
            const cookieToken = req.cookies[cookieOptions.name];
            const requestToken = options.value(req);

            return Boolean(requestToken && cookieToken && cookieToken === requestToken);
        };

        next();
    };

    middleware.validate = function (req, res, next) {
        if (!req.isValidCsrfToken()) {
            throw createError(403, 'Invalid CSRF token', { code: 'EBADCSRFTOKEN' });
        }

        next();
    };

    return middleware;
};

/**
 * Returns token value from request.
 * @param {IncomingMessage} req
 * @return {string}
 */
function defaultValue (req) {
    return (req.body && req.body._csrf_token) ||
        (req.query && req.query._csrf_token) ||
        (req.headers['x-csrf-token']);
}
