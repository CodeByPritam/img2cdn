import type { Context, Handler } from 'hono';
import slugify from '../../lib/slugify.js';
import { CreateGroup } from './groups.service.js';

// Groups Controller
const GroupsController: Handler = async (c: Context) => {

    // Create Group By ({ POST :: /api/v1/groups })
    if (c.req.method === 'POST') {
        const body = await c.req.json<{ name: string; slug: string; }>();
        const { name, slug } = body;

        // Getting Slug & Creating Gropus
        const gSlug = slug ? slugify(slug) : slugify(name);
        return CreateGroup(c, name, gSlug);
    }

}

// Export 
export default GroupsController;