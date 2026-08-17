import crypto from 'node:crypto';

// Generate Unique Group Id
const generateUniqueGroupId = (length = 28): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // First character is always uppercase
    let gid = '';
    gid += uppercase[crypto.randomInt(uppercase.length)];

    // Remaining characters
    for (let i = 1; i < length; i++) { gid += alphanumeric[crypto.randomInt(alphanumeric.length)]; }
    return `GrpID-${gid}`;
};

// Export
export { generateUniqueGroupId };