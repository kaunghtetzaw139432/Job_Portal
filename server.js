// const express=require('express');

import helmet from "helmet";
import express from 'express';

import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors'
import morgan from 'morgan';
import connectDB from './config/db.js';
import testRoute from './routes/testRoutes.js'
import authRoute from './routes/auth.js';
import error from './middlewares/error.js';
import userRoute from './routes/user.js'
import jobRoute from './routes/job.js'

dotenv.config();

connectDB();



const app = express();

app.use(helmet());


// app.use(xss());
app.use(express.json());
app.use(cors())
app.use(morgan("dev"))

app.use('/api/v1', testRoute);
app.use('/auth', authRoute);
app.use('/', userRoute);
app.use('/', jobRoute);


app.use(error);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running in ${process.env.DEV_MODE} on port ${PORT}`.white.bgCyan)
})