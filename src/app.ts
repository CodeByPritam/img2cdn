import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Create :: A Hono instance
const app = new Hono();

// Mount :: toApplication ({ Cors, GeoIP })
app.use('*', cors({ origin: 'http://localhost:8080' }));

// Mount :: Routes

// Export :: Application
export default app;