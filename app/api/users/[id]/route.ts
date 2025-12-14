import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Post from '@/models/Post';
import { getDataFromToken } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const currentUserId = await getDataFromToken(req);
        if (!currentUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const posts = await Post.find({ user: id })
            .populate('user', 'username email')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 });

        return NextResponse.json({ user, posts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
