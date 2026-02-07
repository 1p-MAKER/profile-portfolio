import { NextResponse } from 'next/server';

export async function GET() {
    return new NextResponse('tiktok-developers-site-verification=5Q29KYszIqyMON5kNt901DkAGnPCecNN', {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
