const express = require('express');
const Url = require('../models/url');
const { restrictTo } = require('../middlewares/auth');
const router = express.Router();
router.get('/admin/urls', restrictTo['ADMIN'], async (req, res) => {
    console.log(req.user);
    // if (!req.user) return res.redirect('/login');
    const allUrls = await Url.find({ createdBy: req.user._id });
    res.render('home', {
        urls: allUrls
    })
})

router.get('/', restrictTo['NORMAL', 'ADMIN'], async (req, res) => {
    console.log(req.user);
    // if (!req.user) return res.redirect('/login');
    const allUrls = await Url.find({ createdBy: req.user._id });
    res.render('home', {
        urls: allUrls
    })
})

router.get('/signup', (req, res) => {
    return res.render('signup');
})

router.get('/login', (req, res) => {
    return res.render('login');
})

module.exports = router;