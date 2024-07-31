export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex grow items-center justify-center">{children}</main>
  )
}
