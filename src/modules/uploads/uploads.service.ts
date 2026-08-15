import type { Context } from 'hono';
import { putCommand } from '../../lib/r2-ops.js';
import { uniqueAssetId, fuzzyAssetName } from './uploads.utils.js';
import db from '../../config/db.js';

// Upload Image
const UploadImage = async (c: Context, gid: string, role: string, file: unknown) => {

    // Validate gid, role, file
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const missing = [!gid && "group unique identifier", !role && "role", !file && "file"].filter(Boolean);
    if (missing.length) {
        return c.json({
            success: false,
            message: `(Required) : ${capitalize(missing.join(', '))} is missing...`,
            timestamp: new Date().toISOString(),
        }, 400);
    }

    // Normalize Files
    const files: File[] = Array.isArray(file)
    ? file.filter((leaf): leaf is File => leaf instanceof File)
    : file instanceof File ? [file] : [];

    // Valid uploding
    if (files.length === 0) {
        return c.json({
            success: false,
            message: 'No valid file uploaded...',
            timestamp: new Date().toISOString(),
        }, 400);
    }

    // Main Logic
    try {
        const groupExistInDb = await db.query(`SELECT slug FROM i2c_groups WHERE gid = ? LIMIT 1`, [gid]);
        const group = groupExistInDb[0].results[0];

        // Group not exist
        if (!group) {
            return c.json({
                success: false,
                message: 'Group does not exist...',
                timestamp: new Date().toISOString(),
            }, 400);
        }

        // Get Slug & Loop through
        const slug = group.slug;
        for (const leaf of files) {
            const r2Path = `${slug}/${fuzzyAssetName()}`;
            const inputBuffer = Buffer.from(await leaf.arrayBuffer());

            // Upload to r2 & db
            await putCommand(r2Path, inputBuffer, leaf.type);
            await db.query(`INSERT INTO i2c_images (linkgid, imgassetid, filename, r2key, role, mimetype, size)`,
                [gid, uniqueAssetId(), leaf.name, r2Path, role.toLowerCase(), leaf.type, leaf.size ]
            );

            // Return
            return c.json({
                success: true,
                message: '(Hurray!) : Upload done...',
                timestamp: new Date().toISOString(),
            }, 201);
        }
        
    } catch (error) {
        return c.json({
            success: false,
            message: 'Something went wrong!, uploding failed...',
            timestamp: new Date().toISOString(),
        }, 500);
    }

}

// Export
export { UploadImage };