import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GeoIP } from './middlewares/geo-ip.js';

// Create :: A Hono instance
const app = new Hono();

// Mount :: toApplication ({ Cors, GeoIP })
app.use('*', cors({ origin: 'http://localhost:8080' }));
app.use('*', GeoIP);

// Mount :: Routes

// Export :: Application
export default app;