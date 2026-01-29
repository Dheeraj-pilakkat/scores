import { Event, Group } from '@/models';

/**
 * Recalculates points for all groups based on completed events.
 * This should be called whenever an event is created, updated, or deleted.
 */
export async function recalculatePoints() {
  try {
    // 1. Reset all groups to 0
    await Group.updateMany({}, { total_points: 0, wins_count: 0 });

    // 2. Fetch all completed events
    const completedEvents = await Event.find({ status: 'Completed' });

    // 3. Calculate points
    const groupStats: Record<string, { points: number, wins: number }> = {};
    
    // Initialize for known groups
    const groups = await Group.find({});
    // Create a map for quick lookups and to ensure we only update existing groups
    const validGroupNames = new Set(groups.map(g => g.group_name));

    groups.forEach(g => {
        groupStats[g.group_name] = { points: 0, wins: 0 };
    });

    for (const event of completedEvents) {
        // First place
        if (event.first_place && validGroupNames.has(event.first_place)) {
            // Ensure we initialize if for some reason it wasn't in the initial list (safety check)
            if (!groupStats[event.first_place]) groupStats[event.first_place] = { points: 0, wins: 0 };
            
            groupStats[event.first_place].points += (event.points_awarded?.first ?? 10);
            groupStats[event.first_place].wins += 1;
        }
        // Second place
        if (event.second_place && validGroupNames.has(event.second_place)) {
            if (!groupStats[event.second_place]) groupStats[event.second_place] = { points: 0, wins: 0 };
            groupStats[event.second_place].points += (event.points_awarded?.second ?? 5);
        }
        // Third place
        if (event.third_place && validGroupNames.has(event.third_place)) {
             if (!groupStats[event.third_place]) groupStats[event.third_place] = { points: 0, wins: 0 };
            groupStats[event.third_place].points += (event.points_awarded?.third ?? 3);
        }
    }

    // 4. Update groups
    for (const [groupName, stats] of Object.entries(groupStats)) {
        await Group.findOneAndUpdate(
            { group_name: groupName },
            { total_points: stats.points, wins_count: stats.wins }
        );
    }
    
    console.log('Points recalculated:', groupStats);
    return true;
  } catch (error) {
    console.error('Recalculation error:', error);
    return false;
  }
}
