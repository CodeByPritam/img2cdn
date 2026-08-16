import { Hono } from 'hono';
import CdnController from './cdn.controller.js';

// Create a router instance
const CdnRouter = new Hono();
CdnRouter.get('/:role/:opts/:aid', CdnController);

// Export
export default CdnRouter;