import type { Context } from 'hono';
import { putCommand, existCommand } from '../../lib/r2-ops.js';
import db from '../../config/db.js';

// Create Groups :: Logic
const CreateGroup = async (c: Context, name: string, slug: string, gid: string) => {

    // Validate Inputs ({ slug optional & gid auto generated })
    const missing = [!name && "name"].filter(Boolean);
    if (missing.length) {
        return c.json({
            success: false,
            message: `(Required) : Group name is missing...`,
            timestamp: new Date().toISOString(),
        }, 400);
    }

    // Normalize :: Clean slug (Extra layer) & R2 folder name 
    const cleanSlug = slug.replace(/^\/+/, '');
    const r2FolderName = `${slug}/`;

    // Main Logic
    try { 
        const slugExistsInDb = await db.query(`SELECT id FROM i2c_groups WHERE slug = ? LIMIT 1`, [cleanSlug]);
        const slugfound = slugExistsInDb[0].results.length > 0;
        const folderfound = await existCommand(r2FolderName);

        // Return Exist
        const conflicts = [slugfound && "db slug", folderfound && "r2 folder"].filter(Boolean);
        if (conflicts.length) {
            return c.json({
                success: false,
                message: `Group with ${conflicts.join(", ")} already exists...`,
                timestamp: new Date().toISOString(),
            }, 409);
        }

        // Successfully Put
        await putCommand(r2FolderName, new Uint8Array(0), 'application/x-directory');
        await db.query(`INSERT INTO i2c_groups (name, slug, gid) VALUES (?, ?, ?)`, [name, cleanSlug, gid]);

        // Return On Success
        return c.json({
            success: true,
            group: { name: name, slug: cleanSlug, gid: gid },
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
export { CreateGroup };