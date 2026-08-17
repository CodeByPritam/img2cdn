# Img2Cdn : Real-time image transform infrastructure.

An open-source, free and self-hostable image transformation infrastructure. Bring your own cloud storage (AWS S3, Cloudflare R2, Backblaze B2 etc) and get a real-time API for resizing, cropping, format, conversion, and image effects, with Cloudflare CDN-agnostic caching built in. No vendor lock-in, no per-image billing, just run it yourself.

## Quick Setup :

```bash
npm install
```

* Create environment variables `.env` in img2cdn's root directory:
```
# Application Specific Configuration
PORT=
NODE_ENV=
PROD_URL=

# Cloudflare Regular Configuration
CLOUDFLARE_REQUIRED=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=

# Cloudflare R2 Object Storage Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_PUBLIC_URL=

# Cloudflare D1 Database Configuration
CLOUDFLARE_D1_DATABASE_ID=

# Redis Configuration
REDIS_REST_URL=
REDIS_REST_TOKEN=

# Twilio Messaging Configuration
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

* Set `CLOUDFLARE_REQUIRED=true`

```bash
npm run dev:hono
npm run dev:nodemon
```

## File structure :

```
img2cdn/
├── migration/
│   ├── i2c-groups.sql    ( SQL commands to create img2cdn_groups table )
│   └── i2c-assets.sql    ( SQL commands to create img2cdn_assets table )
├── src/
│   ├── config/
│   │   ├── env.ts       ( Application secret as object )
│   │   ├── twilio.ts    ( Configuration of twilio sms client )
│   │   ├── db.ts        ( D1 database connection client )
│   │   ├── redis.ts     ( @upstash redis connection client )
│   │   └── storage.ts   ( Cloudflare r2 connection client & its other configurations )
│   ├── lib/
│   │   ├── r2-ops.ts           ( Aws R2 ops commands )
│   │   ├── slugify.ts          ( An universal slug generation function )
│   │   └── system-metrics.ts   ( Catch system metrics )
│   ├── middlewares/
│   │   └── geo-ip.ts    ( Get client ip, geolocation )
│   ├── modules/
│   │   ├── cdn/
│   │   │   ├── cdn.route.ts        ( Route for asset provider )
│   │   │   ├── cdn.controller.ts   ( Controller for asset provider )
│   │   │   ├── cdn.service.ts      ( Service hold asset provider logic )
│   │   │   └── i2c.core.ts         ( Application core logic )
│   │   ├── groups/
│   │   │   ├── groups.route.ts         ( Route for groups maker )
│   │   │   ├── groups.controller.ts    ( Controller for groups maker )
│   │   │   ├── groups.service.ts       ( Service that hild core logic for groups maker )
│   │   │   └── groups.utils.ts         ( Utils function for groups maker )
│   │   └── uploads/
│   │   │   ├── uploads.route.ts        ( Route for uplode assets )
│   │   │   ├── uploads.controller.ts   ( Controller for uplode assets )
│   │   │   ├── uploads.service.ts      ( Service that hold core logic for uplode assets )
│   │   │   └── uploads.utils.ts        ( Utils for uplode assets )
│   ├── app.ts  
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── server.ts  
├── tsconfig.json
└── README.md
```

## Status :

Under Development
