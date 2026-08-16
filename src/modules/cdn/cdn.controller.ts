import type { Context, Handler } from 'hono';
import { InternalResolver } from './cdn.service.js';

// Cdn Controller Logic
const CdnController: Handler = async (c: Context) => {
    const namespace = (c.req.param("ins") as string).toLowerCase();

    // Using Internal R2 Keys
    if (namespace === 'k') {
        const role = (c.req.param("role") as string).toLowerCase();
        const opts = (c.req.param("opts") as string).toLowerCase();
        const assetid = (c.req.param("aid") as string);
        return await InternalResolver(c, role, opts, assetid);
    }

    // Else Case
    return c.json({
        success: false,
        message: `Wrong internal namespace...`,
        timestamp: new Date().toISOString(),
    }, 404);

}

// Export
export default CdnController;