import { Hono } from 'hono';
import CdnController from './cdn.controller.js';

// Create a router instance
const CdnRouter = new Hono();
CdnRouter.get('/:ns/:role/:opts/:aid', CdnController);

// Export
export default CdnRouter;