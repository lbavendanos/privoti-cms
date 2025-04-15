export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex grow items-center justify-center">
      <div className="@container grid w-full max-w-7xl grid-cols-12 gap-6 px-6">
        <section className="col-span-12 @lg:col-span-8 @lg:col-start-3 @2xl:col-span-6 @2xl:col-start-4 @5xl:col-span-4 @5xl:col-start-5">
          {children}
        </section>
      </div>
    </main>
  )
}
