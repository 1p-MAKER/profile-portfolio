import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(request: Request) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return NextResponse.json({
            error: 'System Error: GitHub Token not configured',
            details: 'Please set GITHUB_TOKEN in your environment variables.'
        }, { status: 500 });
    }

    try {
        const { content, message } = await request.json();

        // オーナーとリポジトリ名は環境変数か、固定値として設定
        // ここでは実装簡略化のため固定値を使用しますが、必要に応じて環境変数化してください
        const owner = process.env.GITHUB_OWNER || '1p-MAKER';
        const repo = process.env.GITHUB_REPO || 'profile-portfolio';
        const filePath = 'data/content.json';

        const octokit = new Octokit({ auth: token });

        // 1. Get current SHA of content.json
        // ファイルが存在しない場合のハンドリングも考慮が必要ですが、今回は更新前提
        let sha;
        try {
            const { data: currentFile } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
            });

            if (Array.isArray(currentFile)) {
                throw new Error('File path processing error: returned array instead of object');
            }

            sha = currentFile.sha;
        } catch (e) {
            console.error('Error fetching file SHA:', e);
            // ファイルがない場合は新規作成になるのでshaはundefinedのまま進む（createOrUpdateFileContentsの仕様）
            // ただし、今回は既存ファイルの更新なので、取得できない場合はエラーとするのが安全
            return NextResponse.json({ error: 'Failed to fetch current file info from GitHub' }, { status: 500 });
        }

        // 2. Update file
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: message || 'update: content.json via admin tool',
            content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
            sha: sha,
        });

        return NextResponse.json({ success: true, message: 'Successfully updated content.json on GitHub' });
    } catch (error) {
        console.error('GitHub Publish Error:', error);
        return NextResponse.json({
            error: 'Publish failed',
            details: String(error)
        }, { status: 500 });
    }
}
