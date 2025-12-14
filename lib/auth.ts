import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

export async function getDataFromToken(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded.userId;
    } catch (error: any) {
        return null;
    }
}
