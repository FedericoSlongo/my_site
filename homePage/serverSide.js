const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 2053; 

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/kernelkitty.it/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/kernelkitty.it/fullchain.pem')
};

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const apiKey = 'YOUR_API_KEY'; //Empty for obvious reasons :3
const user = 'TheCatItalyDude';

app.use(express.static('public'));

app.get('/now-playing', async (req, res) => {
    try {
        const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json`);
        const track = response.data.recenttracks.track[0];
        const nowPlaying = track["@attr"] && track["@attr"].nowplaying ? `${track.artist['#text']} - ${track.name}` : 'No music currently playing';
        res.json({ nowPlaying: nowPlaying, url: track.url });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

https.createServer(options, app).listen(port, () => {
    console.log(`Server is running at https://kernelkitty.it:${port}`);
});
