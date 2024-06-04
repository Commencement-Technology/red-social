import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {jwtVerify} from 'jose';
export async function middleware(request: NextRequest) {
  const isToken = request.cookies.get('token')?.value;
  if (!isToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  console.log(request.url);
  const {payload} = await jwtVerify(
    isToken,
    new TextEncoder().encode(process.env.SECRECT)
  );

  if (!payload) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (
    request.nextUrl.pathname == '/signin' ||
    request.nextUrl.pathname == '/signup'
  ) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home',
    '/amigos/:path*',
    '/configuracion',
    '/mensaje',
    '/notificaciones/:path*',
    '/perfil',
    '/search',
  ],
};