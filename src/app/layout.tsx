import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AuthProvider from './components/auth/AuthProvider';
import Navbar from './components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEALS - Video Analysis Platform',
  description: 'Search for videos, unlock detailed analyses, and explore smarter ways to understand your content.',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-800 text-white min-h-screen`}>
        <AuthProvider >
          <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </>
        </AuthProvider>
      </body>
    </html>
  );
}

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-gray-800 text-white min-h-screen`}>
//         <AuthProvider>
//           <Navbar />
//           <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             {children}
//           </main>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
