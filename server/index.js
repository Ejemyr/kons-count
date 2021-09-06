const express = require('express');
const cors = require('cors')
const redis = require('redis');
const session = require('express-session');
var RedisStore = require('connect-redis')(session);
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
require('dotenv').config();

const auth = require('./authentication')


var db = redis.createClient();
const countKey = "count";
const maxCountKey = "maxCount";
const lastUpdateKey = "lastUpdate";
db.on('error', function (err) {
    console.log('Error ' + err);
});

const app = express();
const port = process.env.PORT;


app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());


const oneDay = 1000 * 60 * 60 * 12;
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'session',
    store: new RedisStore({ client: db }),
    cookie: { secure: false, maxAge: oneDay },
    saveUninitialized: true,
    resave: false
}));
if (process.env.NODE_ENV === "production") {
    session.cookie.secure = true;
    app.set('trust proxy', 1);
}

const requireLoggedIn = (req, res, next) => {
    if (req.session?.authenticated) {
        next();
    } else {
        res.status(403).send();
    }
}

const sendErrorOrCountResponse = (res, err, count) => {
    if (err) {
        res.status(500).send({error: String(err)});
    } else {
        res.json({count: parseInt(count)});
    }
    return res;
};

app.post('/count/reset', requireLoggedIn, (req, res) => {
    db.SET(countKey, 0);
    db.SET(lastUpdateKey, Math.round(Date.now() / 1000));
    res.json({count: 0});
});

app.post('/count/up', requireLoggedIn, (req, res) => {
    db.INCR(countKey, (err, count) => {
        res = sendErrorOrCountResponse(res, err, count);
    });
    db.SET(lastUpdateKey, Math.round(Date.now() / 1000));
});

app.post('/count/down', requireLoggedIn, (req, res) => {
    db.DECR(countKey, (err, count) => {
        res = sendErrorOrCountResponse(res, err, count);
    });
    db.SET(lastUpdateKey, Math.round(Date.now() / 1000));
});

const getRedisValuePromise = (key) => {
    return new Promise((resv, rej) => {
        db.GET(key, (err, reply) => {
            resv(reply);
        });
    })
}

app.get('/countInfo', async (req, res) => {
    const resValue = {
        count: await getRedisValuePromise(countKey),
        lastUpdate: await getRedisValuePromise(lastUpdateKey),
        maxCount: await getRedisValuePromise(maxCountKey),
    };
    res.json(resValue);
    return res;
});

app.post('/maxCount/set', requireLoggedIn, (req, res) => {
    try {
        const value = parseInt(req.body.value.toString());
        if (value !== NaN && value >= 0) {
            db.SET(maxCountKey, value);
            res.json({value: value})
        } else {
            res.status(400).json({error: "Value is not a positive integer"});
        }
    } catch (error) {
        res.status(400).json({error: "Missformatted data"});
    }

    return res;
});

app.post('/login', (req, res) => {
    auth.verifyAndGetUserID(req.body.token)
        .then(userId => auth.checkPermissionToAccess(userId))
        .then(authenticated => {
            if (authenticated) {
                req.session.authenticated = true;
                res.status(200).json({loggedIn: true});
            } else {
                res.status(403).json({loggedIn: false});
            }
        }).finally("Someone tried...");
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({loggedIn: false});
})

app.get('/loggedin', (req, res) => {
    res.json({loggedIn: req.session?.authenticated || false});
});

app.listen(port, () => {
    db.SETNX(countKey, "0");
    db.SETNX(maxCountKey, "50");
    db.SETNX(lastUpdateKey, Math.round(Date.now() / 1000));
});
