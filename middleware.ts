import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { origin, pathname } = req.nextUrl.clone();

    if (!session) {
        return NextResponse.redirect(`${origin}/auth/login?page=${pathname}`);
    }

    //Middleware pour vérifier si l'utilisateur est authentifié et si le rôle est correct.
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const validRoles = ['admin', 'super-user', 'CEO'];
        if (!validRoles.includes(session.user.role)) {
            return NextResponse.redirect(`${origin}/`);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/checkout/address', '/admin'],
};