import express from 'express';
import cors from 'cors';
import {router} from './routes/user.routes.js';

const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);



// parse application/json
app.use(express.json({ limit: '16kb' }));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Serve static files
app.use(express.static('public'));

// Routes

app.use('/api', router);

app.get('/', (req, res) => {
    res.send('Hello World');
});


export { app };