import sharp from 'sharp';
import type { FormatEnum, OutputOptions } from 'sharp';

// Disable sharp internal cache,
// Set concurrency equals to system cpu core count
sharp.cache(false);
sharp.concurrency(2);

// @type interface :: ImageOpts
interface ImageOpts {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    dpr?: number;
    gravity?: 'center' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
    rotate?: number;
    flip?: 'h' | 'v' | 'hv';
    format?: string;
    quality?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
    blur?: number;
    sharpen?: number;
    gray?: boolean;
    sepia?: boolean;
    border_width?: number;
    border_color?: string;
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

// Parses Hex in Sharp Compatible RGBA Object.
// Falls Back to Opaque Black when Can't be Parsed.
function parseColor(color?: string) {
    if (!color) return { red: 0, green: 0, blue: 0, alpha: 1 };
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

// Image Processing Logic
const ProcessImage = async (buf: Buffer, opts: ImageOpts) => {
    const { width, height, fit = 'cover', dpr, 
    gravity, rotate, flip, quality = 80,
    brightness, contrast, saturation, hue, 
    blur, sharpen, gray, sepia, border_width, border_color } = opts;
    
    // Format Checking
    const rawfmt = (opts.format || 'jpeg').toLowerCase();
    const ext = rawfmt === 'jpg' ? 'jpeg' : rawfmt;
    const format = ext as keyof FormatEnum;

    // Set Pipeline {( Cap:: ~16384x16384 )}
    let pipeline = sharp(buf, { limitInputPixels: 268402689 });

    // Dpr :: Scales the Requested Box before resizing start.
    const dprScale = dpr && dpr > 0 ? dpr : 1;
    const targetWidth = dimensionClamp(width !== undefined ? width * dprScale : undefined);
    const targetHeight = dimensionClamp(height !== undefined ? height * dprScale : undefined);

    // Height & Width
    if (targetWidth !== undefined || targetHeight !== undefined) {
        pipeline = pipeline.resize(targetWidth, targetHeight, { 
            fit, position: gravity ? GRAVITY_MAP[gravity] : 'center', 
        });
    }

    // Rotate
    if (rotate) { pipeline = pipeline.rotate(rotate); }

    // Flip
    if (flip === 'h') { pipeline = pipeline.flop(); } 
    else if (flip === 'v') { pipeline = pipeline.flip(); } 
    else if (flip === 'hv') { pipeline = pipeline.flip().flop(); }

    // Brightness
    if (brightness !== undefined || saturation !== undefined || hue !== undefined) {
        pipeline = pipeline.modulate({ 
            brightness, 
            saturation, 
            hue
        });
    }

    // Contrast
    if (contrast !== undefined) {
        const a = contrast;
        const b = 128 * (1 - a);
        pipeline = pipeline.linear(a, b);
    }
 
    // Blur
    if (blur !== undefined && blur > 0) { pipeline = pipeline.blur(blur); }

    // Sharpen, Gray & Sepia
    if (sharpen !== undefined && sharpen > 0) { pipeline = pipeline.sharpen({ sigma: sharpen }); }
    if (gray) { pipeline = pipeline.grayscale(); }
    if (sepia) { pipeline = pipeline.recomb(SEPIA_MATRIX); }

    // Border Width
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

    // Sharp Output
    const output = await pipeline
    .toFormat(format, { quality } as OutputOptions)
    .toBuffer();

    // Return
    return { output, contentType: CONTENT_TYPE[ext] || 'application/octet-stream' };
}

// Export
export default ProcessImage;