'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/core/auth'
import { Header } from './_components/header/header'
import { Aside } from './_components/aside/aside'

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { check } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!check) router.push('/login')
  }, [check, router])

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
