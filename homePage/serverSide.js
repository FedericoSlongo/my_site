const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 2053; 

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/kernelkitty.it/privkey.pem'), // You can put the path to your letsencrypt keys here to get https support
    cert: fs.readFileSync('/etc/letsencrypt/live/kernelkitty.it/fullchain.pem')
};

const CACHE_TTL = 20 * 1000; // 20 seconds

const cache = {
    nowPlaying: {
        time: 0,
        data: null
    },
    images: new Map()
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
    const now = Date.now();

    if (cache.nowPlaying.data && now - cache.nowPlaying.time < CACHE_TTL) {
        console.log("Sending cached answer for now playing")
        return res.json(cache.nowPlaying.data);
    }

    try {
        const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json`);
        const track = response.data.recenttracks.track[0];
        const nowPlaying = track["@attr"] && track["@attr"].nowplaying ? `${track.artist['#text']} - ${track.name}` : 'No music currently playing';

        cache.nowPlaying = {
            time: now,
            data: { nowPlaying: nowPlaying, url: track.url }
        };

        console.log("Sending new answer for now playing")
        res.json({ nowPlaying: nowPlaying, url: track.url });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getImage', async(req, res) => {
    try {
        const now = Date.now();
        const { artist, song } = req.query;
        if (!artist || !song) {
            return res.status(400).json({ error: 'Missing artist or song parameter' });
        }

        const key = `${artist}-${song}`;
        const cached = cache.images.get(key);
        if (cached && now - cached.time < CACHE_TTL) {
            console.log("Sending cached answer for images")
            return res.json({ image: cached.data });
        }

        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(song)}&format=json`);
        const image = response.data.track.album.image[3]['#text'];
        
        cache.images.set(key, {
            time: now,
            data: image
        });

        console.log("Sending new answer for images")
        res.json({ image });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error Last Fm');
    }
});

app.get('/getRandomTopTrack', async(req, res) => {
    try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${apiKey}&limit=200&format=json`);
        const tracks = response.data.toptracks.track;
        const randomlyChoosenTrack = Math.floor(Math.random() * tracks.length);
        const choosenTrack = tracks[randomlyChoosenTrack];
        res.json({ name : choosenTrack.name, url: choosenTrack.url });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error Last Fm');
    }
});

https.createServer(options, app).listen(port, () => {
    console.log(`Server is running at https://kernelkitty.it:${port}`);
});
