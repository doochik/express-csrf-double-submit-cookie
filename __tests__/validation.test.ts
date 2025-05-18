import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import request from 'supertest';
import { createMiddleware } from '../src';
import { beforeEach, describe, it } from 'vitest';

let app: Express;
beforeEach(() => {
    const middleware = createMiddleware();

    app = express()
        .use(cookieParser())
        .use(middleware)
        .get('/', middleware.validate, function (req, res) {
            res.status(200).end();
        });
});

it('should return 403 if no token in request', () => {
    return request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect(403);
});

it('should return 403 if token is invalid', () => {
    return request(app)
        .get('/?_csrf_token=345')
        .set('Host', 'example.com')
        .set('Cookie', '_csrf_token=123')
        .expect(403);
});

it('should return 200 if token is valid', () => {
    return request(app)
        .get('/')
        .set('Host', 'example.com')
        .set('Cookie', '_csrf_token=123')
        .set('x-csrf-token', '123')
        .expect(200);
});

describe('custom value function', () => {
    beforeEach(() => {
        const middleware = createMiddleware({
            value: (req) => String(req.headers['token']),
        });

        app = express()
            .use(cookieParser())
            .use(middleware)
            .get('/', middleware.validate, function (req, res) {
                res.status(200).end();
            });
    });

    it('should return 403 if no token in request', () => {
        return request(app)
            .get('/')
            .set('Host', 'example.com')
            .set('Cookie', '_csrf_token=123')
            .set('x-csrf-token', '123')
            .expect(403);
    });

    it('should return 200 if token is valid', () => {
        return request(app)
            .get('/')
            .set('Host', 'example.com')
            .set('Cookie', '_csrf_token=123')
            .set('token', '123')
            .expect(200);
    });

});
