import { cn, url } from '@/lib/utils'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/components/query-provider'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
          'bg-background flex min-h-screen flex-col font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
