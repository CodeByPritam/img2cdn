import { serve } from '@hono/node-server';
import app from './src/app.js';

// Application :: Boot
const initServer = () => {
    const port = Number(8000) || 8080;
    const environment: string = 'development';
    const prodUrl: string = 'https://img2cdn.top';

    // Default :: Home Route
    app.get('/', (c) => {
        return c.json({
            message: 'Welcome to Img2Cdn...',
            timestamp: new Date().toISOString(),
        },200);
    });

    // Listen On
    serve({ fetch: app.fetch, port: port }, (info) => {
        console.log(`Server is running On: ${
            environment !== 'production'
            ? `http://localhost:${info.port}`
            : `${prodUrl}`
        }`);
    });

}

// Invoke
initServer();