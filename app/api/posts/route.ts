import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { getDataFromToken } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const following = user.following;
        const feedPosts = await Post.find({
            user: { $in: [...following, userId] },
        })
            .populate('user', 'username email')
            .populate('comments.user', 'username')
            .sort({ createdAt: -1 });

        return NextResponse.json(feedPosts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const caption = formData.get('caption') as string;
        let imageUrl = formData.get('imageUrl') as string;

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create unique filename
            const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);
            imageUrl = `/uploads/${filename}`;
        }

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Image is required (URL or File)' },
                { status: 400 }
            );
        }

        const newPost = await Post.create({
            user: userId,
            imageUrl,
            caption,
        });

        return NextResponse.json(newPost);
    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
