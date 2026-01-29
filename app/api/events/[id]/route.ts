import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Event, Group } from '@/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { recalculatePoints } from '@/lib/actions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const event = await Event.findById(id);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    // 2. Update event
    const updatedEvent = await Event.findByIdAndUpdate(id, body, { new: true });

    // 3. Recalculate points globally to ensure consistency
    // This handles all cases: status change, winner change, points change
    await recalculatePoints();

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update event';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    console.log('Attempting to delete event with ID:', id);
    const event = await Event.findById(id);
    if (!event) {
      console.log('Event not found in DB for ID:', id);
      return NextResponse.json({ error: `Event not found: ${id}` }, { status: 404 });
    }

    await Event.findByIdAndDelete(id);

    // Recalculate points globally
    await recalculatePoints();

    return NextResponse.json({ message: 'Event deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
