import type { Context, Handler } from 'hono';

// Groups Controller
const GroupsController: Handler = async (c: Context) => {
    return c.json({
        message: "Hello from, groups controller...",
        timestamp: new Date().toISOString(),
    }, 200);
}

// Export 
export default GroupsController;