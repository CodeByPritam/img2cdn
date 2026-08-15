import type { Context } from 'hono';
import { putCommand, existCommand } from '../../lib/r2-ops.js';
import db from '../../config/db.js';

// Upload Image
const UploadImage = (c: Context, gid: string, file: unknown) => {
    return c.json({
        gid: gid,
        file: file,
    }, 200);
}

// Export
export { UploadImage };