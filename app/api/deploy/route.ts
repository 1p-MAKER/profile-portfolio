import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
    const logs: string[] = [];
    const addLog = (msg: string) => logs.push(`[${new Date().toISOString()}] ${msg}`);

    try {
        addLog('Starting deployment process...');

        // 0. Pull latest changes to avoid conflicts
        addLog('Executing: git pull origin master');
        try {
            const { stdout: pullOut, stderr: pullErr } = await execPromise('git pull origin master');
            if (pullOut) addLog(`Pull output: ${pullOut}`);
        } catch (e: any) {
            addLog(`Pull warning (non-fatal): ${e.message}`);
        }

        // 1. Add all changes
        addLog('Executing: git add .');
        await execPromise('git add .');

        // 2. Commit
        addLog('Executing: git commit');
        try {
            await execPromise('git commit -m "content: update via admin tool"');
            addLog('Commit successful');
        } catch (e: any) {
            if (e.stdout?.includes('nothing to commit')) {
                addLog('Nothing to commit (clean working tree)');
            } else {
                throw e;
            }
        }

        // 3. Push to GitHub
        addLog('Executing: git push origin master');
        const { stdout: pushOut, stderr: pushErr } = await execPromise('git push origin master');
        if (pushOut) addLog(`Push output: ${pushOut}`);
        if (pushErr) addLog(`Push stderr: ${pushErr}`);

        addLog('Deployment process completed successfully.');
        return NextResponse.json({ success: true, message: 'Deployed successfully!', logs });

    } catch (error: any) {
        console.error('Deployment error:', error);
        addLog(`FATAL ERROR: ${error.message}`);
        if (error.stderr) addLog(`STDERR: ${error.stderr}`);
        if (error.stdout) addLog(`STDOUT: ${error.stdout}`);

        return NextResponse.json({ error: 'Deployment failed', logs }, { status: 500 });
    }
}
