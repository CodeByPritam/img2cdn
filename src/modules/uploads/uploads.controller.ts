import type { Context, Handler } from 'hono';
import { UploadImage } from './uploads.service.js';

// Uploads Controller
const UploadsController: Handler = async (c: Context) => {

    // Upload Assets ({ POST :: /api/v1/upload })
    if (c.req.method === 'POST') {
        const body = await c.req.parseBody({ all: true });
        const { gid, role, kind, obj } = body;
        const makeGid = `GrpID-${gid}`;
        return await UploadImage(c, makeGid as string, role as string, kind as string, obj);
    }

}

// Export
export default UploadsController;