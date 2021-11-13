require('dotenv').config({ silent: true })
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { saveUrl, getUrls } = require('./controllers/history')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.FRONTEND_ADDRESS }))

// Logger
app.use(async (req, res, next) => {
	const url = req.originalUrl;
	await saveUrl(url);
	next();
});

app.get('/', (req, res) => {
	res.status(200).send("Hi there")
});

app.get('/history', async (req, res) => {
    const history = await getUrls();
	response = "U r browsing history:<br>" + history.map(h => `- ${h.url}\t-\t${h.createdAt}`).join('<br>')
    res.status(200).send(response);
})

app.get('*', (req, res) => {
	const url = req.originalUrl;
    res.status(200).send("U r in " + url);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('App is running ;)');
});
