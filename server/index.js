const express = require('express');
const cors = require('cors')
const redis = require('redis');
const session = require('express-session');
var RedisStore = require('connect-redis')(session);
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
require('dotenv').config();

const auth = require('./authentication')


var db = redis.createClient({
        url: 'redis://konst-count-redis:6379'
    }
);

const countMembersKey = "countMembers";
const countGuestsKey = "countGuests";
const maxCountKey = "maxCount";
const lastUpdateKey = "lastUpdate";
const liveKey = "live";
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


const halfDay = 1000 * 60 * 60 * 12;
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'session',
    store: new RedisStore({ client: db }),
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: halfDay },
    saveUninitialized: true,
    resave: false
}));

const requireLoggedIn = (req, res, next) => {
    if (req.session?.authenticated) {
        next();
    } else {
        res.status(403).send();
    }
}

const sendErrorOrCountResponse = (res, err, countMembers=undefined, countGuests=undefined) => {
    if (err) {
        res.status(500).send({error: String(err)});
    } else {
        res.json({countMembers: parseInt(countMembers), countGuests: parseInt(countGuests)});
    }
    return res;
};

app.post('/count/reset', requireLoggedIn, (req, res) => {
    db.SET(countMembersKey, 0);
    db.SET(countGuestsKey, 0);
    db.SET(lastUpdateKey, Math.round(Date.now() / 1000));
    res.json({countMembers: 0, countGuests: 0});
});

app.post('/count/members/up', requireLoggedIn, (req, res) => {
    db.INCR(countMembersKey, (err, countMembers) => {
        res = sendErrorOrCountResponse(res, err, countMembers, undefined);
    });
    db.SET(lastUpdateKey, Math.round(Date.now() / 1000));
});

app.post('/count/members/down', requireLoggedIn, (req, res) => {
    db.DECR(countMembersKey, (err, countMembers) => {
        res = sendErrorOrCountResponse(res, err, countMembers, undefined);
    });
    db.SET(lastUpdateKey, Math.round(Date.now() / 1000));
});

app.post('/count/guests/up', requireLoggedIn, (req, res) => {
    db.INCR(countGuestsKey, (err, countGuests) => {
        res = sendErrorOrCountResponse(res, err, undefined, countGuests);
    });
    db.SET(lastUpdateKey, Math.round(Date.now() / 1000));
});

app.post('/count/guests/down', requireLoggedIn, (req, res) => {
    db.DECR(countGuestsKey, (err, countGuests) => {
        res = sendErrorOrCountResponse(res, err, undefined, countGuests);
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

// TODO: Should this requireLoggedIn?
app.post('/setLive', (req, res) => {
    try {
        if (req.body.value === "true" || req.body.value === "false") {
            db.SET(liveKey, req.body.value);
            res.json({value: req.body.value})
        } else {
            res.status(400).json({error: "Value is not parsable to a boolean value"});
        }
    } catch (error) {
        res.status(400).json({error: "Missformatted data"});
    }

    return res;
});

app.get('/countInfo', async (req, res) => {
    const live = await getRedisValuePromise(liveKey);
    var resValue;
    if (live === "true" || req.session?.authenticated) {
        resValue = {
            live: live,
            countMembers: await getRedisValuePromise(countMembersKey),
            countGuests: await getRedisValuePromise(countGuestsKey),
            lastUpdate: await getRedisValuePromise(lastUpdateKey),
            maxCount: await getRedisValuePromise(maxCountKey),
        };
    } else {
        resValue = {
            live: live
        };
    }
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
    db.SETNX(countMembersKey, "0");
    db.SETNX(countGuestsKey, "0");
    db.SETNX(maxCountKey, "50");
    db.SETNX(lastUpdateKey, Math.round(Date.now() / 1000));
    db.SETNX(liveKey, "true");
});
