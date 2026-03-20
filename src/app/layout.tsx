import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { VideoRecorderWidget } from '@/components/VideoRecorderWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500'] });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['600', '700'] });

export const metadata: Metadata = {
  title: 'BharatGig | India\'s Premium Freelance Marketplace',
  description: 'The heartbeat of Indian talent. Connect with top freelancers, manage projects with Lead Lock, and secure transactions with e-KYC.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-white">
        <Providers>
          <main>{children}</main>
          <VideoRecorderWidget />
        </Providers>
      </body>
    </html>
  );
}
