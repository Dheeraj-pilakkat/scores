import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Group, Admin, Event } from '@/models'; // adjust import if I put them in index.ts
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    // 0. Cleanup Legacy Groups
    await Group.deleteMany({ group_id: { $in: ['A', 'B', 'C'] } });

    // 1. Seed Groups
    const groups = [
      {
        group_id: '1',
        group_name: 'Group 1',
        group_color: '#EF4444', // Red-500
        total_points: 0,
        wins_count: 0
      },
      {
        group_id: '2',
        group_name: 'Group 2',
        group_color: '#22C55E', // Green-500
        total_points: 0,
        wins_count: 0
      },
      {
        group_id: '3',
        group_name: 'Group 3',
        group_color: '#3B82F6', // Blue-500
        total_points: 0,
        wins_count: 0
      }
    ];

    for (const group of groups) {
      await Group.findOneAndUpdate(
        { group_id: group.group_id },
        group,
        { upsert: true, new: true }
      );
    }

    // 2. Seed Admin
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await Admin.findOneAndUpdate(
      { username: adminUsername },
      {
        username: adminUsername,
        password: hashedPassword,
        email: 'admin@example.com'
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
