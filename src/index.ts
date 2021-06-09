import * as dotenv from 'dotenv'
//For environment variables
dotenv.config()
import { initializeApiKey } from './utils/index';
import express from 'express'
import cors from 'cors'
import apiRouter from './routes';
import { youtubeFetchDataScheduler } from './utils/scheduler';
import ClientError from './libs/ClientError'
import responseGenerator from './libs/responseGenerator';

const app = express()

// Interface for Global variables
declare global {
    namespace NodeJS {
        interface Global {
            api_keys: any
        } 
    }
}

// Body Parser middleware
app.use(express.json())

// CORS
app.use(cors())

// Initialize API key's for multiple key usage
global.api_keys = initializeApiKey()

// Routes goes here
app.use('/api', apiRouter)

// Error handling
app.use((req: any, res: any, next: any) => {
    const error: any = new Error('The page you are looking for not found');
    error.status = 404;
    return next(error);
});

app.use((err: any, req: any, res: any, next: any) => {
    console.log(err.message, err.stack);
    if (err instanceof ClientError) {
        return responseGenerator(true, err.message, err.status, err.data, res);
    }
    return res;
});

// Scheduler activity goes here
youtubeFetchDataScheduler()

const port = process.env.PORT || 5000 

app.listen(port, () => console.log(`Server started on port : ${port}`))