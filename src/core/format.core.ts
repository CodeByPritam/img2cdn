import type { Sharp } from 'sharp';
import type { ImageOpts } from './opts.parser.js';

// Apply Format & Quality
const applyFormatAndQuality = (pipeline: Sharp, opts: ImageOpts) => {
    const quality = (opts.q === 'auto' || opts.q === undefined) ? 80 : opts.q;
    const format = (opts.fmt === 'auto' || opts.fmt === undefined) ? 'jpg' : opts.fmt;

    // Switch Between Format
    switch (format) {
        case 'png':
            return { pipeline: pipeline.png({ quality }), mimetype: 'image/png' };
        case 'webp':
            return { pipeline: pipeline.webp({ quality }), mimetype: 'image/webp' };
        case 'avif':
            return { pipeline: pipeline.avif({ quality }), mimetype: 'image/avif' };
        case 'gif':
            return { pipeline: pipeline.gif(), mimetype: 'image/gif' };
        case 'jpg':
            return { pipeline: pipeline.jpeg({ quality }), mimetype: 'image/jpeg' };
        default:
            break;
    }
}

// Export 
export default applyFormatAndQuality;