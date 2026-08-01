'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

//  Middlewares 
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  credentials: true,               // Allow cookies (Authdata JWT)
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

//  Routes 
const notificationRoutes = require('./src/modules/notification/notification.routes');
app.use('/api/notifications', notificationRoutes);

//  404 Handler 
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: `Route ${req.originalUrl} not found` });
});

//  Global Error Handler 
const errorMiddleware = require('./src/middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;
