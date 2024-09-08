'use client'

import { useAuth } from '@/core/auth'
import { Header } from './_components/app/header/header'
import { Aside } from './_components/app/aside/aside'
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
    <div className="flex min-h-screen w-full flex-col">
      <Aside />
      <div className="flex grow flex-col md:pl-56 lg:pl-72">
        <Header />
        <main className="flex grow pt-14 lg:pt-[60px]">{children}</main>
      </div>
    </div>
  )
}
