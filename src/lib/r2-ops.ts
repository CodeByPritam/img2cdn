import { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { r2, r2BucketName } from '../config/storage.js';

// Put Object Into Storage
const putCommand = async (key: string, body: Uint8Array, contentType: string) => {
    return r2.send(
        new PutObjectCommand({
            Bucket: r2BucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        }),
    );
}

// Delete Object From Storage
const deleteCommand = async (key: string) => {
    return r2.send(
        new DeleteObjectCommand({
            Bucket: r2BucketName,
            Key: key,
        }),
    );
}

// Check Exist
const existCommand = async (key: string): Promise<boolean> => {
    try {
        await r2.send(
            new HeadObjectCommand({
                Bucket: r2BucketName,
                Key: key,
            }),
        );
        return true;
    } catch (error) {
        return false;
    }
}

// Export
export { putCommand, deleteCommand, existCommand };