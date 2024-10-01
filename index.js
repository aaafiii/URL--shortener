const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { connectToDB } = require('./connection');
const path = require('path');
const port = 8000;
const urlRouter = require('./routes/url.js');
const staticRouter = require('./routes/staticRouter.js')
const userRouter = require('./routes/user.js');
const URL = require('./models/url.js');
const { restrictToLoggedInUserOnly, checkAuth, restrictTo } = require('./middlewares/auth.js');
const cookieParser = require("cookie-parser");

connectToDB('mongodb://localhost:27017/url-shortner')
    .then(() => {
        console.log("mongodb connected successfully")
    })
    .catch(() => {
        console.log("mongodb connection failed")
    })


app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use('/url', restrictTo(['NORMAL', 'ADMIN']), urlRouter);
app.use('/user', userRouter);
app.use('/', checkAuth, staticRouter);
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const foundedUrl = await URL.findOneAndUpdate(
        {
            shortId: shortId
        },
        {
            $push: {
                visitoryHistory: {
                    timestamp: Date.now()
                }
            }
        }
    )
    if (foundedUrl) {
        res.redirect(foundedUrl.redirectUrl);
    }
    else {
        return res.json({ status: false, message: "Short id not found" });
    }
})

app.listen(port, () => {
    console.log('Listening on port ', port);
})