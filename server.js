const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(express.static(path.join(__dirname, 'public')));

// TMDb API configuration
const TMDB_API_KEY = '9b3944f823049578eae5343f45e9d74e'; // Replace with your TMDb API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Fetch popular movies from TMDb
app.get('/api/movies', async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1
            }
        });
        res.json(response.data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

const chatLogFile = path.join(__dirname, 'chatlog.json');

// Nodemailer Setup (Use your own email credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testprojsrlabs@gmail.com', // Replace with your email
        pass: 'dlzu bgrc ywpu uada'   // Replace with your app password
    }
});

// Function to log messages to a JSON file
function logMessage(username, message) {
    const logEntry = { username, message, timestamp: new Date().toISOString() };
    
    fs.readFile(chatLogFile, (err, data) => {
        let chatLogs = [];
        if (!err && data.length > 0) {
            chatLogs = JSON.parse(data);
        }
        chatLogs.push(logEntry);
        fs.writeFile(chatLogFile, JSON.stringify(chatLogs, null, 4), (err) => {
            if (err) console.error('Error saving chat log:', err);
        });
    });
}

// Function to send email notification
function sendEmailNotification(username) {
    const mailOptions = {
        from: 'testprojsrlabs@gmail.com',
        to: 'rishabhbhasin7777@gmail.com',
        subject: 'New User Login Alert - Schat-StreamFlix',
        text: `${username} has accessed the chatbox at ${new Date().toLocaleString()}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

app.get('/get-chat-logs', (req, res) => {
    const chatLogFile = path.join(__dirname, 'chatlog.json');

    fs.readFile(chatLogFile, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Could not read chat logs" });
        }
        res.json(JSON.parse(data));
    });
});


// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('user login', (username) => {
        console.log(`${username} logged in`);
        sendEmailNotification(username);
    });

    socket.on('chat message', ({ username, message }) => {
        io.emit('chat message', { username, message });
        logMessage(username, message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
