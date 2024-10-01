const { getUser } = require('../services/auth.js');

async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies.uid;
    if (!userUid) {
        return res.redirect('/login');
    }
    const user = getUser(userUid);
    if (!user) return res.redirect('/login');
    req.user = user;
    console.log(req.user);
    next();
}

async function checkAuth(req, res, next) {
    const userUid = req.cookies.uid;
    const user = getUser(userUid);
    req.user = user;
    next();
}

function checkForAuthentication(req, res, next) {
    const authValue = req.cookies.token;
    req.user = null;
    if (!authValue) {
        return next();
    }
    const token = authValue;
    const user = getUser(token);
    req.user = user;
    return next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        if (!roles.includes(req.user.role)) {
            return res.end("UnAuthorized")
        }
        return next();
    }
}

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth,
    restrictTo
}