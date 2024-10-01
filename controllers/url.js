const shortid = require('shortid');
const URL = require('../models/url.js');

async function handleCreateNewShortUrl(req, res) {
    const shortId = shortid(8);
    const url = req.body.url;
    if (!url) {
        return res.json({ status: false, message: "url is required" });
    }
    const newUrl = await URL.create({
        shortId: shortId,
        redirectUrl: url,
        visitoryHistory: [],
        createdBy: req.user._id,
    })
    return res.render("home", {
        id: shortId
    })
    return res.json({ status: true, id: shortId })
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClick: result.visitoryHistory.length,
        analytics: result.visitoryHistory
    })
}

module.exports = {
    handleCreateNewShortUrl,
    handleGetAnalytics
}
