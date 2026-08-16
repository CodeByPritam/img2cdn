import type { Sharp } from 'sharp';
import type { ImageOpts } from './opts.parser.js';

// Apply Resize
const applyResize = (pipeline: Sharp, opts: ImageOpts): Sharp => {
    if (!opts.w && !opts.h) return pipeline;

    // Set Dpr, Height & Width
    const dpr = opts.dpr ?? 1;
    const targetWidth = opts.w ? Math.round(opts.w * dpr) : undefined;
    const targetHeight = opts.h ? Math.round(opts.h * dpr) : undefined;

    // Return
    return pipeline.resize({
        width: targetWidth,
        height: targetHeight,
        fit: opts.fit ?? 'cover',
        position: 'center',
        withoutEnlargement: false,
    });
};

// Export
export default applyResize;