import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { VideoRecorderWidget } from '@/components/VideoRecorderWidget';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['600', '700'] });

export const metadata: Metadata = {
  title: 'BharatGig | Premium Freelance Marketplace',
  description: 'The heartbeat of Indian talent. Connect with top freelancers, manage projects with Lead Lock, and secure transactions with e-KYC.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased text-slate-500 bg-[#fafafa] relative overflow-x-hidden min-h-screen">
        
        {/* Global Abstract Background Blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] will-change-transform" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] will-change-transform" />
        </div>

        <Providers>
          <ErrorBoundary>
            <main className="relative z-10">{children}</main>
          </ErrorBoundary>
          <VideoRecorderWidget />
        </Providers>
      </body>
    </html>
  );
}
