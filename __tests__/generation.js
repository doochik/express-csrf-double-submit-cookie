'use strict';

const cookieParser = require('cookie-parser');
const express = require('express');
const request = require('supertest');

const csrfMiddleware = require('..');

let app;
beforeEach(() => {
    app = express()
        .use(cookieParser())
        .use(csrfMiddleware())
        .get('/', function (req, res) {
            res.status(200).json(req.cookies);
        });
});

it('should create token and set cookie if no cookies in request', () => {
    return request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect(200)
        .expect('set-cookie', /_csrf_token=[0-9a-f]+; Path=\//);
});

it('should create token and set cookie if no cookie-token in request', () => {
    return request(app)
        .get('/')
        .set('Host', 'example.com')
        .set('Cookie', 'foo=bar;bar=baz')
        .expect(200)
        .expect('set-cookie', /^_csrf_token=[0-9a-f]+; path=\/$/i);
});

it('should create token and write it to req.cookies', () => {
    return request(app)
        .get('/')
        .set('Host', 'example.com')
        .set('Cookie', 'foo=bar;bar=baz')
        .expect(200)
        .expect((res) => {
            expect(res.body).toMatchObject({
                foo: 'bar',
                bar: 'baz',
                _csrf_token: expect.stringMatching(/[0-9a-f]+/),
            });
        });
});

it('should not create new cookie if exists', () => {
    return request(app)
        .get('/')
        .set('Host', 'example.com')
        .set('Cookie', '_csrf_token=12345678790')
        .expect(200)
        .expect((res) => {
            expect(res.headers['set-cookie']).toBeUndefined();
        });
});

it('should apply cookie options', () => {
    const app = express()
        .use(cookieParser())
        .use(csrfMiddleware({ cookie: { domain: '.example.com' } }))
        .get('/', function (req, res) {
            res.status(200).end();
        });

    return request(app)
        .get('/')
        .set('Host', 'example.com')
        .set('Cookie', 'foo=bar;bar=baz')
        .expect(200)
        .expect('set-cookie', /^_csrf_token=[0-9a-f]+; domain=.example.com; path=\/$/i);
});
