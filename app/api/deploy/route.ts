import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
    try {
        // 1. Add all changes
        await execPromise('git add .');
        // 2. Commit
        await execPromise('git commit -m "content: update via admin tool"');
        // 3. Push to GitHub (triggers Vercel deployment)
        await execPromise('git push origin master');

        return NextResponse.json({ success: true, message: 'Deployed successfully!' });
    } catch (error) {
        console.error('Deployment error:', error);
        return NextResponse.json({ error: 'Deployment failed', details: String(error) }, { status: 500 });
    }
}
