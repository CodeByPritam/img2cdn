import type { Context, Handler } from 'hono';
import crypto from 'node:crypto';
import slugify from '../../lib/slugify.js';
import { createGroup } from './groups.service.js';

// Groups Specific Gkey
function gkey(length = 28): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // Get key & First character is always uppercase
    let key = '';
    key += uppercase[crypto.randomInt(uppercase.length)];

    // Remaining characters
    for (let i = 1; i < length; i++) { key += alphanumeric[crypto.randomInt(alphanumeric.length)]; }
    return key;
}

// Groups Controller
const GroupsController: Handler = async (c: Context) => {

    // Create Group By ({ POST :: /api/v1/groups })
    if (c.req.method === 'POST') {
        const body = await c.req.json<{
            name: string;
            slug: string;
        }>();

        // Getting Name & Slug
        const { name, slug } = body;
        const finalSlug = slug ? slugify(slug) : slugify(name);
        return createGroup(c, name, finalSlug, gkey());
    }

    // Others :: Coming Soon

}

// Export 
export default GroupsController;