import './config/instrument.mjs'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'

//initialize express
const app= express()

//connect to Database
await connectDB()
await connectCloudinary()

//middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

//routes
// All your controllers should live here


app.get('/',function rootHandler (req,res){ res.send("API working");})

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");});

app.post('/webhooks', express.raw({ type: '*/*' }), clerkWebhooks);

app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)
//port
const PORT= process.env.PORT || 5000

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app); 

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})