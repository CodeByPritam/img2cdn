import type { Context } from 'hono';
import { r2PublicUrl } from '../../config/storage.js';
import db from '../../config/db.js';

// Logic :: Internal Resolver
const InternalResolver = async (c: Context, role: string, opts: string, aid: string) => {

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

    // Make Asset ID, DB Lookup
    const AssetId = `AssetID-${aid.split('.')[0]}`;
    const result = await db.query(`SELECT r2key from i2c_assets WHERE assetid = ? LIMIT 1`, [AssetId]);
    const r2key = result[0].results[0].r2key;

    // Make Asset URL & Send Http Request
    const assetUrl = `${r2PublicUrl}/${r2key}`;
    const res = await fetch(assetUrl, { redirect: 'follow' });

    // Get Buffer & Extract Opts
    const buffer = Buffer.from(await res.arrayBuffer());
    const instruction = Object.fromEntries(
        opts.split(',').map((item) => {
            const [key, value] = item.split('_');
            return [key, Number(value)];
        })
    );

    // Image Resize, Quality & Format Change Caller
    //const { output, ctype } = await Images();
    //c.header('Content-Type', ctype);
    //c.header('Cache-Control', 'public, max-age=31536000, immutable');
    //c.header('CDN-Cache-Control', 'max-age=31536000');

    // Return
    //return c.body(Uint8Array.from(output), 200);
};

// Export
export { InternalResolver };