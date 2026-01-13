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
            const { stdout: pullOut } = await execPromise('git pull origin master');
            if (pullOut) addLog(`Pull output: ${pullOut}`);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            addLog(`Pull warning (non-fatal): ${msg}`);
        }

        // 1. Add all changes
        addLog('Executing: git add .');
        await execPromise('git add .');

        // 2. Commit
        addLog('Executing: git commit');
        try {
            await execPromise('git commit -m "content: update via admin tool"');
            addLog('Commit successful');
        } catch (e: unknown) {
            const isClean = e instanceof Error && 'stdout' in e && (e as { stdout: string }).stdout?.includes('nothing to commit');
            if (isClean) {
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

        // 4. Force Vercel Deployment (Manual fallback)
        addLog('Executing: npx vercel --prod --yes');
        try {
            const { stdout: vercelOut, stderr: vercelErr } = await execPromise('npx vercel --prod --yes');
            // Vercel CLI often outputs to stderr for status updates
            if (vercelOut) addLog(`Vercel output: ${vercelOut}`);
            if (vercelErr) addLog(`Vercel status: ${vercelErr}`);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            addLog(`Vercel deployment warning: ${msg}`);
            // vercel command might fail if not logged in, but we try anyway
        }

        addLog('Deployment process completed successfully.');
        return NextResponse.json({ success: true, message: 'Deployed successfully!', logs });

    } catch (error: unknown) {
        console.error('Deployment error:', error);
        const msg = error instanceof Error ? error.message : String(error);
        addLog(`FATAL ERROR: ${msg}`);

        if (typeof error === 'object' && error !== null) {
            if ('stderr' in error) addLog(`STDERR: ${(error as { stderr: string }).stderr}`);
            if ('stdout' in error) addLog(`STDOUT: ${(error as { stdout: string }).stdout}`);
        }

        return NextResponse.json({ error: 'Deployment failed', logs }, { status: 500 });
    }
}
