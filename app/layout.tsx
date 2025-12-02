import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '../components/layout/theme-provider';

export const metadata = {
  title: 'Kiwi System',
  description: 'ERP/CRM básico con Next.js'
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
