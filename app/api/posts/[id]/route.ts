import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User'; // Ensure User model is registered
import { getDataFromToken } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const post = await Post.findById(id)
            .populate('user', 'username email')
            .populate('comments.user', 'username');

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
