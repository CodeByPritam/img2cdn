import type { Context } from 'hono';
import { putCommand, existCommand } from '../../lib/r2-ops.js';
import db from '../../config/db.js';

// Create Groups :: Logic
const createGroup = async (c: Context, name: string, slug: string, gkey: string) => {
    const r2FolderName = `${slug}/`;
    const dbSlug = `/${slug}`;
    try { 
        const slugExistsInDb = await db.query(`SELECT id FROM i2c_groups WHERE slug = ? LIMIT 1`, [dbSlug]);
        const slugfound = slugExistsInDb[0].results.length > 0;
        const folderfound = await existCommand(r2FolderName);

        // Return Exist
        if (slugfound || folderfound) {
            return c.json({
                success: false,
                message: 'Group already exists...',
                timestamp: new Date().toISOString(),
            }, 409);
        }

        // Successfully Put
        await putCommand(r2FolderName, new Uint8Array(0), 'application/x-directory');
        await db.query(`INSERT INTO i2c_groups (name, slug, gkey) VALUES (?, ?, ?)`, [name, dbSlug, gkey]);

        // Return On Success
        return c.json({
            success: true,
            group: {
                name: name,
                slug: dbSlug,
                gkey: gkey,
            },
            message: 'Group created successfully...',
            timestamp: new Date().toISOString(),
        }, 200);

    } catch (error) { 
        return c.json({
            success: false,
            message: 'Creation failed...',
            timestamp: new Date().toISOString(),
        }, 500);
    }
}

// Export
export { createGroup };