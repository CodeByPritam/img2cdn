import env from './env.js';

// Setup D1 :: database connection
const db = async (sql: string, params: unknown[] = []) => {
    const dbUrl = `https://api.cloudflare.com/client/v4/accounts/${env.cloudflare.accountId}/d1/database/${env.cloudflare.d1.databaseId}/query`;
    const res = await fetch(dbUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.cloudflare.apiToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params, }),
    });

    // Getting Data & Connection Check
    const data = await res.json();
    if (!res.ok || !data.success) { throw new Error('Cloudflare db connection failed'); }

    // Return
    return data.result;
}

// Export
export default db;