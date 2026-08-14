import { Hono } from 'hono';
import GroupsController from './groups.controller.js';

// Create an instance of router
const GroupsRouter = new Hono();
GroupsRouter.post('/groups', GroupsController);
GroupsRouter.get('/groups/:gkey', GroupsController);
GroupsRouter.patch('/groups/:gkey', GroupsController);
GroupsRouter.delete('/groups/:gkey', GroupsController);

// Export
export default GroupsRouter;