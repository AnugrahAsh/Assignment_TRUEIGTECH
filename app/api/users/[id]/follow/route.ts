import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getDataFromToken } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const currentUserId = await getDataFromToken(req);
        if (!currentUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: targetUserId } = await params;

        if (currentUserId === targetUserId) {
            return NextResponse.json(
                { error: 'You cannot follow yourself' },
                { status: 400 }
            );
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(
                (id: any) => id.toString() !== targetUserId
            );
            targetUser.followers = targetUser.followers.filter(
                (id: any) => id.toString() !== currentUserId
            );
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        return NextResponse.json({
            success: true,
            isFollowing: !isFollowing,
            currentUser,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
