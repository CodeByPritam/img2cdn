import { Hono } from 'hono';
import UploadsController from './uploads.controller.js';

// Create an instance of router
const UploadsRouter = new Hono();
UploadsRouter.post('/uploads', UploadsController); // Upload Images
UploadsRouter.get('/uploads', UploadsController); // List All Images
UploadsRouter.get('/uploads/:imguniqid', UploadsController); // Get Specific Image
UploadsRouter.patch('/uploads/:imguniqid', UploadsController); // Edit Specific Image
UploadsRouter.delete('/uploads/:imguniqid', UploadsController); // Delete Specific Image

// Export
export default UploadsRouter;