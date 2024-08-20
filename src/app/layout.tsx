import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { cn, url } from '@/lib/utils'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export function generateMetadata(): Metadata {
  const appName = process.env.NEXT_PUBLIC_APP_NAME as string

  return {
    metadataBase: url(),
    title: {
      template: `%s | ${appName}`,
      default: appName,
    },
    description: `${appName} es un dashboard para administrar tus tareas.`,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const appLocale = process.env.NEXT_PUBLIC_APP_LOCALE

  return (
    <html lang={appLocale} suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
