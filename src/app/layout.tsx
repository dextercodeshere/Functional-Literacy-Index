import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: "India's Literacy Assessment & Knowledge Platform | BHARAT BODHA",
  description: "Independent national research, functional literacy assessment, trivia, and data journalism platform for India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#0A192F] antialiased selection:bg-amber-200 selection:text-amber-950">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
