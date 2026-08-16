const M = Math;

// @type interface :: Image Opts
export interface ImageOpts {

    // Resize :: v1
    w?: number;
    h?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    dpr?: number;

    // Crop, Flip & Rotate :: ( Coming Soon )
    g?: 'center' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
    flip?: 'h' | 'v' | 'hv';
    rotate?: number;

    // Format & Quality :: v1
    fmt?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif' | 'gif';
    q?: number | 'auto';

    // Color Adjustment :: ( Coming Soon )
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;

    // Filters & Effects :: ( Coming Soon )
    blur?: number;
    sharpen?: number;
    gray?: boolean;
    sepia?: boolean;

    // Border :: ( Coming Soon )
    border_width?: number;
    border_color?: string;

};

// Make Clamp
const clamp = (val: number, min: number, max: number) => M.min(M.max(val, min), max);

// Create :: Image Parser
const parseOptsSegment = (segment: string): ImageOpts => {
    const opts: ImageOpts = {};
    const parts = segment.split(',');

    // Extract {( key:value )}
    for (const pair of parts) {
        const [rawKey, rawVal] = pair.split(':');
        const key = rawKey.trim();
        const val = rawVal.trim();

        // Use Switch-Case
        switch (key) {
            case 'w': {
                const n = parseInt(val, 10);
                if (!isNaN(n)) opts.w = clamp(n, 1, 8000);
                break;
            }
            case 'h': {
                const n = parseInt(val, 10);
                if (!isNaN(n)) opts.h = clamp(n, 1, 8000);
                break;
            }
            case 'fit': {
                if (['cover', 'contain', 'fill', 'inside', 'outside'].includes(val)) { opts.fit = val as ImageOpts['fit']; }
                break;
            }
            case 'dpr': {
                const n = parseFloat(val);
                if (!isNaN(n)) opts.dpr = clamp(n, 1, 3);
                break;
            }
            case 'fmt': {
                if (['auto', 'jpg', 'png', 'webp', 'avif', 'gif'].includes(val)) { opts.fmt = val as ImageOpts['fmt']; }
                break;
            }
            case 'q': {
                if (val === 'auto') { opts.q = 'auto'; } 
                else { 
                    const n = parseInt(val, 10); 
                    if (!isNaN(n)) opts.q = clamp(n, 1, 100);
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    // Return
    return opts;

};

// Export
export default parseOptsSegment;