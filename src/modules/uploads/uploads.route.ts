import { Hono } from 'hono';
import UploadsController from './uploads.controller.js';

// Create an instance of router
const UploadsRouter = new Hono();
UploadsRouter.post('/upload', UploadsController); // Upload Images
UploadsRouter.get('/upload', UploadsController); // List Images
UploadsRouter.get('/upload/:imguniqkey', UploadsController); // Get Specific Image
UploadsRouter.patch('/upload/:imguniqkey', UploadsController); // Edit Specific Image
UploadsRouter.delete('/upload/:imguniqkey', UploadsController); // Delete Specific Image

// Export
export default UploadsRouter;