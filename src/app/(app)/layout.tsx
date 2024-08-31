'use client'

import { useAuth } from '@/core/auth'
import { Header } from './_components/header/header'
import { Aside } from './_components/aside/aside'
import { AppLoading } from './_components/app/app-loading'
import { AppUnauthenticated } from './_components/app/app-unauthenticated'
import { AppUnverified } from './_components/app/app-unverified'

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { check, user, isLoading } = useAuth()

  if (isLoading) return <AppLoading />

  if (!check) return <AppUnauthenticated />

  if (check && !user?.email_verified_at) return <AppUnverified />

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Aside />
      <div className="flex flex-col">
        <Header />
        <main className="flex grow">{children}</main>
      </div>
    </div>
  )
}
