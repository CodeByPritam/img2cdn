import { serve } from '@hono/node-server';
import app from './src/app.js';
import env from './src/config/env.js';

// Application :: Boot
const initServer = () => {
    const port = Number(env.port) || 8080;

    // Default :: Home Route
    app.get('/', (c) => {
        return c.json({
            message: 'Welcome to Img2Cdn...',
            timestamp: new Date().toISOString(),
        },200);
    });

    // Whoami Route
    app.get('/whoami', (c) => {
        const ip = c.get("client_ip");
        const geo = c.get("client_geolocation");

        // Return
        return c.json({
            ip: ip === '::1' ? '127.0.0.1' : ip,
            geo: geo
        }, 200);
    });

    // Listen On
    serve({ fetch: app.fetch, port: port }, (info) => {
        console.log(`Server is running On: ${
            env.environment !== 'production'
            ? `http://localhost:${info.port}`
            : `${env.prodUrl}`
        }`);
    });

}

// Invoke
initServer();