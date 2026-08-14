import { config } from 'dotenv';
config();

// Application :: Configuration
const env = {
    prodUrl: process.env.PROD_URL,
    port: process.env.PORT,
    environment: process.env.NODE_ENV,

    // Object Storage
    cloudflare: {
        required: process.env.CLOUDFLARE_REQUIRED,
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        apiToken: process.env.CLOUDFLARE_API_TOKEN,
        r2ObjectStorage: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
        },
        d1: {
            databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID,
        },
    },

    // Redis
    redis: {
        url: process.env.REDIS_REST_URL,
        token: process.env.REDIS_REST_TOKEN,
    },

    // SMS Service
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        tokenforAuth: process.env.TWILIO_AUTH_TOKEN,
    },

}

// Export
export default Object.freeze(env);