import type { Context } from 'hono';
import { r2PublicUrl } from '../../config/storage.js';
import db from '../../config/db.js';
import ProcessImage from './i2c.core.js';

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

    // Main Logic
    try {
        const AssetId = `AssetID-${aid.split('.')[0]}`;
        const result = await db.query(`SELECT * from i2c_assets WHERE assetid = ? AND role = ? LIMIT 1`, [AssetId, role]);
        
        // Wrong Role
        if (result[0].results.length === 0) {
            return c.json({ 
                success: false,
                message: `Wrong role provided...`,
                timestamp: new Date().toISOString(),
            }, 200);
        }

        // Get r2Key & Send Http Request
        const r2key = result[0].results[0].r2key;
        const res = await fetch(`${r2PublicUrl}/${r2key}`, { redirect: 'follow' });

        // Get Buffer & Extract Opts
        const inputBuffer = Buffer.from(await res.arrayBuffer());
        const instruction = Object.fromEntries(
            opts.split(',').map((item) => {
                const [key, value] = item.split(':');
                const num = Number(value);
                const parsed = value !== '' && !Number.isNaN(num) ? num : value;
                return [key, parsed];
            })
        );

        // Process Image Caller
        const { output, contentType } = await ProcessImage(inputBuffer, instruction);
        c.header('Content-Type', contentType);
        c.header('Cache-Control', 'public, max-age=31536000, immutable');
        c.header('CDN-Cache-Control', 'max-age=31536000');

        // Return
        return c.body(Uint8Array.from(output), 200);
    } catch (error) {
        return c.json({
            success: false,
            message: 'Something went wrong!, image processing failed...',
            timestamp: new Date().toISOString(),
        }, 500);
    }
};

// Export
export { InternalResolver };