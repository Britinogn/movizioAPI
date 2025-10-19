import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;
import cors from 'cors'


/** Import Routes */
import authRoute from './routes/authRoute.js'

connectDB();

/** Middleware  */
app.use(express.json());
app.use(cors());


/** Use imported Routes */
app.use('/api/auth', authRoute);

//error handler
app.use((req, res)=> {
    res.status(404).json({message: ' Routes not found'})
})

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Movizio API 🎬' });
});

app.listen(PORT, () => console.log( ` 🚀 Server running on port ${PORT}`));
