import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GeoIP } from './middlewares/geo-ip.js';
import GroupsRouter from './modules/groups/groups.route.js';
import UploadsRouter from './modules/uploads/uploads.route.js';
import CdnRouter from './modules/cdn/cdn.route.js';

// Create :: A Hono instance
const app = new Hono();

// Mount :: toApplication ({ Cors, GeoIP })
app.use('*', cors({ origin: 'http://localhost:8080' }));
app.use('*', GeoIP);

// Mount :: Routes
app.route('/api/v1', GroupsRouter);
app.route('/api/v1', UploadsRouter);
app.route('/v1/k', CdnRouter);

// Export :: Application
export default app;