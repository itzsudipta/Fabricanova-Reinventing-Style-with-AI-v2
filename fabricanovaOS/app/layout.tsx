import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
    title: 'CoutureOS | AI Fashion Design Platform',
    description: 'The Neural Loom for Modern Fashion Design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} bg-stone-50 font-sans text-stone-900 antialiased`}>
                {children}
            </body>
        </html>
    );
}