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

        // Determine upload directory based on file type
        let uploadSubDir = '3d-print'; // default
        if (file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.endsWith('.mp3')) {
            uploadSubDir = 'audio';
        }

        // Create specific filename with timestamp to avoid collisions
        const filename = `upload_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
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
