import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HealthyIA - Tu plan alimenticio inteligente',
  description: 'App de nutrición con inteligencia artificial',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider>
          <Navbar />
          <main className="min-h-screen bg-linear-to-br from-green-50 to-blue-50">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}