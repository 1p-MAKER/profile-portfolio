
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${id}&country=jp&entity=software`);
    if (!res.ok) {
      throw new Error('Failed to fetch data from iTunes API');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('iTunes API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
