import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadType = formData.get('type') as string;

        // Determine upload directory based on file type or explicit type param
        let uploadSubDir = '3d-print'; // default
        let targetFilename = '';

        if (uploadType === 'profile') {
            uploadSubDir = 'profile';
            targetFilename = 'profile.jpg'; // Force filename for profile image
        } else if (file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.endsWith('.mp3')) {
            uploadSubDir = 'audio';
        } else if (uploadType === 'general') {
            uploadSubDir = 'uploads';
        }

        // Create specific filename with timestamp to avoid collisions (unless overridden)
        const filename = targetFilename || `upload_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', uploadSubDir);

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        await fs.writeFile(path.join(uploadDir, filename), buffer);

        return NextResponse.json({ success: true, path: `/${uploadSubDir}/${filename}` });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
