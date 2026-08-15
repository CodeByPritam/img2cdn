import crypto from 'crypto';

// Generate Unique Asset ID
function uniqueAssetId(length = 22): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // First character is always uppercase
    let aid = '';
    aid += uppercase[crypto.randomInt(uppercase.length)];

    // Remaining characters
    for (let i = 1; i < length; i++) { aid += alphanumeric[crypto.randomInt(alphanumeric.length)]; }
    return `AssetID-${aid}`;
};

// Generate Fuzzy Assets Name ({ Image })
function fuzzyAssetName(length = 28): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // First character is always uppercase
    let fuzzy = '';
    fuzzy += uppercase[crypto.randomInt(uppercase.length)];

    // Remaining characters
    for (let i = 1; i < length; i++) { fuzzy += alphanumeric[crypto.randomInt(alphanumeric.length)]; }
    return fuzzy;
};

// Export
export { uniqueAssetId, fuzzyAssetName };