import type { Context } from 'hono';
import { putCommand, existCommand } from '../../lib/r2-ops.js';
import db from '../../config/db.js';

// Create Groups :: Logic
const createGroup = async (c: Context, name: string, slug: string, gid: string) => {
    const r2FolderName = `${slug}/`;
    const dbSlug = `/${slug}`;
    try { 
        const slugExistsInDb = await db.query(`SELECT id FROM i2c_groups WHERE slug = ? LIMIT 1`, [dbSlug]);
        const slugfound = slugExistsInDb[0].results.length > 0;
        const folderfound = await existCommand(r2FolderName);

        // Return Exist
        const missing = [!slugfound && "slug", !folderfound && "folder"].filter(Boolean);
        if (missing.length) {
            return c.json({
                success: false,
                message: `Group with ${missing.join(", ")} already exists...`,
                timestamp: new Date().toISOString(),
            }, 409);
        }

        // Successfully Put
        await putCommand(r2FolderName, new Uint8Array(0), 'application/x-directory');
        await db.query(`INSERT INTO i2c_groups (name, slug, gid) VALUES (?, ?, ?)`, [name, dbSlug, gid]);

        // Return On Success
        return c.json({
            success: true,
            group: {
                name: name,
                slug: dbSlug,
                gid: gid,
            },
            message: 'Group created successfully...',
            timestamp: new Date().toISOString(),
        }, 200);
    } catch (error) { 
        return c.json({
            success: false,
            message: 'Something went wrong!, Creation failed...',
            timestamp: new Date().toISOString(),
        }, 500);
    }
}

// Export
export { createGroup };