[![Build Status](https://travis-ci.org/doochik/express-csrf-double-submit-cookie.svg?branch=master)](https://travis-ci.org/doochik/express-csrf-double-submit-cookie)

# express-csrf-double-submit-cookie

Express CSRF token middleware with ["Double submit cookie"](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Double_Submit_Cookie)

Requires [cookie-parser](https://www.npmjs.com/package/cookie-parser) to be initialized first.

## Installation

```sh
$ npm install express-csrf-double-submit-cookie
```

## Usage

```js
const cookieParser = require('cookie-parser')
const csrfDSC = require('express-csrf-double-submit-cookie')
const express = require('express')

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
const csrfDSC = require('express-csrf-double-submit-cookie')
const csrfProtection = csrfDSC([options]);
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

