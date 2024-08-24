'use client'

import { useAuth } from '@/core/auth'
import { Header } from './_components/header/header'
import { Aside } from './_components/aside/aside'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Loading() {
  return (
    <main className="flex grow flex-col justify-center">
      <section className="container h-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="text-center text-base text-muted-foreground">
              Cargando...
            </h1>
          </div>
        </div>
      </section>
    </main>
  )
}

function Unauthenticated() {
  return (
    <main className="flex grow flex-col justify-center">
      <section className="container h-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="flex flex-col gap-4">
              <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
                No estás autenticado
              </h1>
              <p className="text-center text-base text-muted-foreground lg:text-lg">
                Si ya tienes una cuenta, por favor{' '}
                <Button
                  variant="link"
                  className="h-fit w-fit p-0 text-base"
                  asChild
                >
                  <Link href="/login">inicia sesión</Link>
                </Button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { check, isLoading } = useAuth()

  if (isLoading) return <Loading />

  if (!check) return <Unauthenticated />

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
