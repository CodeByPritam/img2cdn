import type { Context } from 'hono';
import { r2PublicUrl } from '../../config/storage.js';
import db from '../../config/db.js';
import { ImageCompose, OptsResolver } from './i2c.core.js';

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

        // Get Buffer
        const inputBuffer = Buffer.from(await res.arrayBuffer());

        // Extract Opts
        const parts = opts.split(',').map((p) => p.trim());
        const isDefault = parts.some((p) => p.toLowerCase() === 'default');

        // Everything Except 'default' Will Parsed => {( key:value )}
        const others = parts.filter((p) => p.toLowerCase() !== 'default');
        const pair = Object.fromEntries(
            others
            .filter((item) => item.includes(':'))
            .map((item) => {
                const [key, value] = item.split(':');
                const num = Number(value);
                const parsed = value !== '' && !Number.isNaN(num) ? num : value;
                return [key, parsed];
            })
        );

        // Rule 01 :: 'default' Can't be Combined {( With :: Width/Height )}
        if (isDefault && ('w' in pair || 'h' in pair)) {
            return c.json({
                success: false,
                message: `(Oops!) : Both width & height cannot be passed together with 'default'...`,
                timestamp: new Date().toISOString(),
            }, 400);
        }

        // Rule :: Without 'default', {( Width & Height )} Both Required
        if (!isDefault && (!('w' in pair) || !('h' in pair))) {
            return c.json({
                success: false,
                message: `(Required) : Both width (w:value) & height (h:value) must be provided...`,
                timestamp: new Date().toISOString(),
            }, 400);
        }

        // Merge :: Preset Ad Base, Overrides Always Win
        const hw = OptsResolver(role);
        const instruction = isDefault ? { ...hw, ...pair } : pair;

        // Compose Image & Cloudflare-CDN Headers
        const { output, contentType } = await ImageCompose(inputBuffer, instruction);
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