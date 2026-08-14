import { Hono } from 'hono';
import GroupsController from './groups.controller.js';

// Create an instance of router
const GroupsRouter = new Hono();
GroupsRouter.post('/groups', GroupsController); // Create Groups
GroupsRouter.get('/groups', GroupsController); // List All Groups
GroupsRouter.get('/groups/:gkey', GroupsController); // Get Specific Group
GroupsRouter.patch('/groups/:gkey', GroupsController); // Edit Specific group
GroupsRouter.delete('/groups/:gkey', GroupsController); // Delete Specific Group

// Export
export default GroupsRouter;