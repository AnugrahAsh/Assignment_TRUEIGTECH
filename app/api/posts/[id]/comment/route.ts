import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { getDataFromToken } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
        }

        const { id } = await params;
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const newComment = {
            user: userId,
            text,
            createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        return NextResponse.json(post);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
