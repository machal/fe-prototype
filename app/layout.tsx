import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FrontKon - Databáze přednášek, speakerů a témat',
  description: 'Databáze přednášek, speakerů a témat z konference FrontKon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>
        <div className="app">
          <header className="header">
            <Link href="/">
              <h1>FrontKon</h1>
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}

