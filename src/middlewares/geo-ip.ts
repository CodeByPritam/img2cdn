import type { Context, Next } from 'hono';
import { getConnInfo } from '@hono/node-server/conninfo';
import ipaddr from 'ipaddr.js'; // Utilize in v2

// @type inerface :: Geolocation
interface Geolocation {
    country: string | null;
    continent: string | null;
    city: string | null;
    region: string | null;
    regionCode: string | null;
    postalCode: string | null;
    metroCode: string | null;
    timezone: string | null;
    lat: string | null;
    lon: string | null;
};

// Get Client Ip
const ipResolver = (c: Context) => {
    const cfConnectingIp = c.req.header("cf-connecting-ip");
    if (cfConnectingIp) return cfConnectingIp;

    // As Fallback
    const connInfo = getConnInfo(c);
    return connInfo.remote.address ?? '0.0.0.0';
}

// Get Client Geolocation
const geoResolver = (c: Context): Geolocation => {
    return {
        country: c.req.header("cf-ipcountry") ?? null,
        continent: c.req.header("cf-ipcontinent") ?? null,
        city: c.req.header("cf-ipcity") ?? null,
        region: c.req.header("cf-region") ?? null,
        regionCode: c.req.header("cf-region-code") ?? null,
        postalCode: c.req.header("cf-postal-code") ?? null,
        metroCode: c.req.header("cf-metro-code") ?? null,
        timezone: c.req.header("cf-timezone") ?? null,
        lat: c.req.header("cf-iplatitude") ?? null,
        lon: c.req.header("cf-iplongitude") ?? null,
    };
}

// Export :: ({ GeoIp })
export const GeoIP = async (c: Context, next: Next) => {
    const ip = ipResolver(c);
    const geo = geoResolver(c);
    const geoip = [ip, geo];

    // Set to context
    c.set("geo-ip", geoip);
    await next();
}