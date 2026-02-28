import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';
import { HouseholdProvider } from '@/contexts/HouseholdContext';

export const metadata: Metadata = {
  title: 'MealPlanner',
  description: 'Family meal planning made simple',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAFA] min-h-screen">
        <HouseholdProvider>
          <main className="mx-auto max-w-md pb-24">
            {children}
          </main>
          <BottomNav />
        </HouseholdProvider>
      </body>
    </html>
  );
}
