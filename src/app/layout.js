import { Raleway } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/hook/authContext';
import ClientLayout from '@/components/clientLayout';

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
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
