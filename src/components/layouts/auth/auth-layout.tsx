export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex grow items-center justify-center">
      <section className="w-full max-w-md px-6">{children}</section>
    </main>
  )
}
