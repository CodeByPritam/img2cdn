import type { Context, Handler } from 'hono';

// Cdn Controller Logic
const CdnController: Handler = async (c: Context) => {
    return c.json({
        message: "Hello from, cdn controller...",
        timestamp: new Date().toISOString(),
    }, 200);
}

// Export
export default CdnController;