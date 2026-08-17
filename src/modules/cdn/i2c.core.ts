import os from 'node:os';
import sharp from 'sharp';
import type { FormatEnum, OutputOptions } from 'sharp';

// Disable sharp internal cache,
// Set concurrency equals to system cpu core count
sharp.cache(false);
sharp.concurrency(os.cpus().length);

// @type interface :: ImageOpts
interface ImageOpts {
    w?: number; // ({ Width })
    h?: number; // ({ Height })
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'; // ({ Fit })
    dpr?: number; // ({ Dpr :: Integer })
    g?: 'center' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west'; // ({ Gravity })
    rotate?: number; // ({ Rotate })
    flip?: 'h' | 'v' | 'hv'; // ({ Flip })
    fmt?: string; // ({ Format })
    q?: number; // ({ Quality })
    brightness?: number; // ({ Brighness })
    contrast?: number; // ({ Contrast })
    saturation?: number; // ({ Saturation })
    hue?: number; // ({ Hue })
    blur?: number; // ({ Blur })
    sharpen?: number; // ({ Sharpen })
    gray?: boolean; // ({ Grayscale })
    sepia?: boolean; // ({ Sepia })
    border_width?: number; // ({ Border Width In px })
    border_color?: string; // ({ Border Color })
};

// Default Content Type
const CONTENT_TYPE: Record<string, string> = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
};

// Gravity Map :: Sharp Position Keyword
const GRAVITY_MAP = {
    center: 'center',
    north: 'north',
    south: 'south',
    east: 'east',
    west: 'west',
    north_east: 'north_east',
    north_west: 'north_west',
    south_east: 'south_east',
    south_west: 'south_west',
};

// Standard Sepia Color Matrix :: ({ Applied via Sharps recomb() method })
const SEPIA_MATRIX: [[number, number, number], [number, number, number], [number, number, number]] = [
    [0.393, 0.769, 0.189],
    [0.349, 0.686, 0.168],
    [0.272, 0.534, 0.131],
];

// Default Presets
const defaultOpts: Record<string, ImageOpts> = { 
    banner: { w: 1280, h: 720 },
    poster: { w: 600, h: 900 },
};

// Opts Resolver
const OptsResolver = (role: string) => defaultOpts[role];

// Parses Hex in Sharp Compatible RGBA Object.
// Falls Back to Opaque Black when Can't be Parsed.
function parseColor(colorCode?: string) {
    if (!colorCode) return { red: 0, green: 0, blue: 0, alpha: 1 };
    let color = `#${colorCode}`;
    let hex = color.trim();
    if (hex.startsWith('#')) hex = hex.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');

    // Six Character Color Code
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        return {
            red: parseInt(hex.slice(0, 2), 16),
            green: parseInt(hex.slice(2, 4), 16),
            blue: parseInt(hex.slice(4, 6), 16),
            alpha: 1,
        };
    }

    // Eight Character Color Code
    if (/^[0-9a-fA-F]{8}$/.test(hex)) {
        return {
            red: parseInt(hex.slice(0, 2), 16),
            green: parseInt(hex.slice(2, 4), 16),
            blue: parseInt(hex.slice(4, 6), 16),
            alpha: parseInt(hex.slice(6, 8), 16) / 255,
        };
    }

    // Fallback
    return { red: 0, green: 0, blue: 0, alpha: 1 };
}

// Max Diamention
const MAX_DIMENSION = 16384;
const M = Math;
function dimensionClamp(n?: number) {
    if (n === undefined || !Number.isFinite(n) || n <= 0) return undefined;
    return M.min(M.round(n), MAX_DIMENSION);
}

// Image Composer Logic
const ImageCompose = async (buf: Buffer, opts: ImageOpts) => {
    const { 
        w, h, fit = 'cover', dpr, 
        g, rotate, flip, 
        q = 80, fmt = 'jpg',
        brightness, contrast, saturation, hue, 
        blur, sharpen, gray, sepia, 
        border_width, border_color,
    } = opts;
    
    // Format Checking :: ({ default :: 'jpeg', 'jpg' })
    const lowerfmt = fmt.toLowerCase();
    const format = (lowerfmt === 'jpg' ? 'jpeg' : lowerfmt) as keyof FormatEnum;

    // Set Pipeline {( Cap:: ~16384x16384 )}
    let pipeline = sharp(buf, { limitInputPixels: 268402689 });

    // Dpr :: Scales Requested Box Before Resizing start.
    const dprScale = dpr && dpr > 0 ? dpr : 1;
    const tw = dimensionClamp(w !== undefined ? w * dprScale : undefined);
    const th = dimensionClamp(h !== undefined ? h * dprScale : undefined);

    // Set :: Height & Width Of Image
    if (tw !== undefined || th !== undefined) {
        pipeline = pipeline.resize(tw, th, { 
            fit: fit, 
            position: g ? GRAVITY_MAP[g] : 'center', 
        });
    }

    // Set :: Rotate Of Image
    if (rotate) { pipeline = pipeline.rotate(rotate); }

    // Set :: Flip Of Image
    if (flip === 'h') { pipeline = pipeline.flop(); } 
    else if (flip === 'v') { pipeline = pipeline.flip(); } 
    else if (flip === 'hv') { pipeline = pipeline.flip().flop(); }

    // Set :: Brightness Of Image
    if (brightness !== undefined || saturation !== undefined || hue !== undefined) {
        pipeline = pipeline.modulate({ brightness, saturation, hue });
    }

    // Set :: Contrast Of Image
    if (contrast !== undefined) {
        const a = contrast;
        const b = 128 * (1 - a);
        pipeline = pipeline.linear(a, b);
    }
 
    // Set :: Blur Of Image
    if (blur !== undefined && blur > 0) { pipeline = pipeline.blur(blur); }

    // Set :: Sharpen, Gray & Sepia Of Image
    if (sharpen !== undefined && sharpen > 0) { pipeline = pipeline.sharpen({ sigma: sharpen }); }
    if (gray) { pipeline = pipeline.grayscale(); }
    if (sepia) { pipeline = pipeline.recomb(SEPIA_MATRIX); }

    // Set :: Border Width Of Image
    if (border_width && border_width > 0) {
        const color = parseColor(border_color);
        pipeline = pipeline.extend({
            top: border_width,
            bottom: border_width,
            left: border_width,
            right: border_width,
            background: color,
        });
    }

    // Sharp Output - Pipeline All Options
    const output = await pipeline
    .toFormat(format, { q } as OutputOptions)
    .toBuffer();

    // Return
    return { output, contentType: CONTENT_TYPE[format] || 'application/octet-stream' };
}

// Export
export { ImageCompose, OptsResolver };