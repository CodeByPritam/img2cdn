import type { Context } from 'hono';
import { r2PublicUrl } from '../../config/storage.js';
import db from '../../config/db.js';

// Logic :: Internal Resolver
const InternalResolver = async (c: Context, role: string, opts: unknown, aid: string) => {

    // Validate Inputs
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const missing = [!role && "role", !opts && "instructions", !aid && "asset id"].filter(Boolean);
    if (missing.length) {
        return c.json({
            success: false,
            message: `(Required) : ${capitalize(missing.join(', '))} is missing...`,
            timestamp: new Date().toISOString(),
        }, 400);
    }

    // Make Asset ID, DB Lookup & Make Asset URL
    const AssetId = `AssetID-${aid.split('.')[0]}`;
    const result = await db.query(`SELECT r2key from i2c_assets WHERE assetid = ? LIMIT 1`, [AssetId]);
    const r2key = result[0].results[0].r2key;
    const assetUrl = `${r2PublicUrl}/${r2key}`;


    return c.json({
        assetUrl
    }, 200);

};

// Export
export { InternalResolver };