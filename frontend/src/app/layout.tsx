import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
