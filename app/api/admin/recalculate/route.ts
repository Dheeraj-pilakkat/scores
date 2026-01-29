import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Event, Group } from '@/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { recalculatePoints } from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const success = await recalculatePoints();

    if (success) {
        return NextResponse.json({ message: 'Points recalculated successfully' });
    } else {
        return NextResponse.json({ error: 'Failed to recalculate points' }, { status: 500 });
    }
  } catch (error) {
    console.error('Recalculation error:', error);
    return NextResponse.json({ error: 'Failed to recalculate points' }, { status: 500 });
  }
}
