import type { Context, Handler } from 'hono';

// Uploads Controller
const UploadsController: Handler = async (c: Context) => {
    return c.json({
        message: "Hello from, uploads controller...",
        timestamp: new Date().toISOString(),
    }, 200);
}

// Export
export default UploadsController;