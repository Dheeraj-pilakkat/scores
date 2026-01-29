import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Group } from '@/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    // Sort by total_points descending
    const groups = await Group.find({}).sort({ total_points: -1 });
    return NextResponse.json(groups);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json(); // Expecting array of groups
    await dbConnect();

    for (const groupData of body) {
        if (groupData._id) {
            await Group.findByIdAndUpdate(groupData._id, {
                group_name: groupData.group_name,
                group_color: groupData.group_color
            });
        }
    }

    return NextResponse.json({ message: 'Groups updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update groups' }, { status: 500 });
  }
}
