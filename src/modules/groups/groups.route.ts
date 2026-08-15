import { Hono } from 'hono';
import GroupsController from './groups.controller.js';

// Create an instance of router
const GroupsRouter = new Hono();
GroupsRouter.post('/groups', GroupsController); // Create Groups
GroupsRouter.get('/groups', GroupsController); // List All Groups From Both D1 & R2
GroupsRouter.get('/groups/:gid', GroupsController); // Get Specific Group
GroupsRouter.patch('/groups/:gid', GroupsController); // Edit Specific group
GroupsRouter.delete('/groups/:gid', GroupsController); // Delete Specific Group

// Export
export default GroupsRouter;