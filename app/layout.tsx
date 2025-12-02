import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '../components/layout/theme-provider';

export const metadata = {
  title: 'Kiwi System',
  description: 'ERP/CRM básico con Next.js',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/kiwi-logo.svg', type: 'image/svg+xml' }
    ],
    shortcut: ['/icon.svg'],
    apple: ['/icon.svg']
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
