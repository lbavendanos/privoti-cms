export function AppLoading() {
  return (
    <main className="flex grow flex-col justify-center">
      <section className="container h-full">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="text-center text-base text-muted-foreground">
              Loading...
            </h1>
          </div>
        </div>
      </section>
    </main>
  )
}
