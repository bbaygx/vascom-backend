import { NextResponse } from 'next/server';

export function middleware(request) {
  // Daftar route yang ingin Anda terapkan redirect ke halaman login
  const protectedRoutes = ['/api', '/dashboard', '/'];

  // Periksa apakah request.url cocok dengan salah satu route yang dilindungi
  if (protectedRoutes.includes(request.url.pathname)) {
    // Redirect ke halaman login jika request.url cocok dengan route yang dilindungi
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Jika tidak ada redirect yang diperlukan, lanjutkan request
  return NextResponse.next();
}

export const config = {
  // Atur matcher sesuai kebutuhan Anda, misalnya, Anda bisa menambahkan rute yang dilindungi di sini
  matcher: ['/(.*)'],
};
