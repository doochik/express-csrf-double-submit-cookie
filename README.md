# express-csrf-double-submit-cookie

Express CSRF token middleware with ["Naive Double-Submit Cookie Pattern"](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#naive-double-submit-cookie-pattern-discouraged)

Requires [cookie-parser](https://www.npmjs.com/package/cookie-parser) to be initialized first.

## Installation

```sh
$ npm install express-csrf-double-submit-cookie
```

## Usage

```js
import cookieParser from 'cookie-parser';
import csrfDSC from 'express-csrf-double-submit-cookie';
import express from 'express';

// create middleware
const csrfProtection = csrfDSC();

const app = express();
app.use(cookieParser());

// middleware to set cookie token 
app.use(csrfProtection)

// protect /api
app.post('/api', csrfProtection.validate, function (req, res) {
  res.status(200).end();
})

```

## API

```js
import csrfDSC from 'express-csrf-double-submit-cookie';

const  csrfProtection = csrfDSC([options]);
```

### Options

* `length` - token length in bytes. Default to 18.
* `value` - function to get token from request. Default to
```js
function defaultValue (req) {
    return (req.body && req.body._csrf_token) ||
        (req.query && req.query._csrf_token) ||
        (req.headers['x-csrf-token']);
}
```
* `cookie` - Cookie options, see express [res.cookie() documentation](http://expressjs.com/en/4x/api.html#res.cookie). Defaults to `{ name: '_csrf_token', path: '/', httpOnly: false }`

