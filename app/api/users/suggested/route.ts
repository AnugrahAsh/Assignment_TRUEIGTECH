import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getDataFromToken } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Find users that are NOT in the following list and NOT the current user
        // Limit to 5 for suggestions
        const suggestedUsers = await User.find({
            _id: { $nin: [...currentUser.following, userId] },
        })
            .select('username email followers')
            .limit(5);

        return NextResponse.json(suggestedUsers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
