const express = require('express');
const shortid = require('shortid');
const { urls } = require('./urlData');

let router = express.Router();

router.get('/',(req,res) => {
    const urlList = [];

    if (Object.entries(urls).length === 0){
        res.status(400).send({'error':'URL list is empty'})
    } else {
        Object.keys(urls).forEach((urlId) => {
            urlList.push({ id: urlId, long_url: urls[urlId] });
        });
        res.send(urlList);
    }
});

router.post('/',(req,res) => {
    const longUrl = req.body.long_url;
    if (req.body.long_url) {
        const id = shortid.generate();
        urls[id] = longUrl;
        res.status(201).send({ id });
    } else {
        res.status(400).send({error: 'invalid request body'});
    }
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const longUrl = urls[id];
    const response = urls[id];

    if (longUrl) {
        res.send({ id, long_url: longUrl });
    } else {
        res.status(404).send({ error: 'invalid url id' });
    }
})

module.exports = router;