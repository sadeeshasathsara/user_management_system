import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import apiRoutes from './src/routes/api.route.js'

dotenv.config();

// Create app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join('src', 'uploads')));


app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

//API Routes
app.use('/api/v1', apiRoutes);

await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(`MongoDB Connected.`)
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`✅ Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((e) => {
        console.log(`Connection error: ${e}`);
    })