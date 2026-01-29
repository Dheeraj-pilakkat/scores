import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Event } from '@/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { recalculatePoints } from '@/lib/actions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const query: any = {};
    if (category && category !== 'All') query.event_category = category;
    if (status && status !== 'All') query.status = status;

    await dbConnect();
    
    // Sort by status (Ongoing -> Upcoming -> Completed) could be complex, 
    // but usually sorting by date is better or we do it in client.
    // Let's sort by date descending for now.
    const events = await Event.find(query).sort({ event_date: -1 });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const newEvent = await Event.create(body);

    // Auto-recalculate if the new event is already completed (e.g. bulk import or immediate completion)
    // Even if not completed, good practice to ensure state consistency, but critical for completed.
    if (newEvent.status === 'Completed') {
        await recalculatePoints();
    }

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
