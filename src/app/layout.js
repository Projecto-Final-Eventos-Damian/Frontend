import { Raleway } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/navbar.js';
import { AuthProvider } from '@/services/authContext.js';

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata = {
  title: 'EventMix',
  description: 'EventMix created by Damián',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <AuthProvider>
          <header className="flex items-center justify-between py-4 px-6 border-b">
            <h1 className="text-4xl font-bold">EventMix</h1>
            <Navbar />
          </header>
          <main>
            {children}
          </main>
          <footer>
            <p>&copy; 2025 EventMix. Todos los derechos reservados.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
