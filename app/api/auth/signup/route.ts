import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Please provide all fields' },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
