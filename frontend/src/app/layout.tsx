import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body >
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
