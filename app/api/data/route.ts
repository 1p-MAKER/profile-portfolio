import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const jsonDirectory = path.join(process.cwd(), 'data');
        const fileContents = await fs.readFile(jsonDirectory + '/content.json', 'utf8');
        return NextResponse.json(JSON.parse(fileContents));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const jsonDirectory = path.join(process.cwd(), 'data');
        await fs.writeFile(jsonDirectory + '/content.json', JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}
