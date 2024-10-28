import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthErrorFooter } from './_components/auth-error-footer'

const AUTH_VERIFY_EMAIL_ERROR = 'verify-email'
const AUTH_VERIFY_NEW_EMAIL_ERROR = 'verify-new-email'

type AuthError =
  | typeof AUTH_VERIFY_EMAIL_ERROR
  | typeof AUTH_VERIFY_NEW_EMAIL_ERROR

function AuthErrorTitle({ type }: { type: AuthError }) {
  return (
    <h1 className="text-center text-3xl font-bold tracking-tight lg:text-4xl">
      {[AUTH_VERIFY_EMAIL_ERROR, AUTH_VERIFY_NEW_EMAIL_ERROR].includes(type) &&
        'Error al verificar correo electrónico'}
    </h1>
  )
}

function AuthErrorDescription({ type }: { type: AuthError }) {
  return (
    <p className="text-center text-base text-muted-foreground lg:text-lg">
      {[AUTH_VERIFY_EMAIL_ERROR, AUTH_VERIFY_NEW_EMAIL_ERROR].includes(
        type,
      ) && (
        <>
          La solicitud de verificación de correo electrónico ha caducado. Vuelva
          a generar una nueva solicitud.
        </>
      )}
    </p>
  )
}

export async function generateMetadata(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const searchParams = await props.searchParams
  const type = searchParams.type as AuthError | undefined

  if (
    type &&
    [AUTH_VERIFY_EMAIL_ERROR, AUTH_VERIFY_NEW_EMAIL_ERROR].includes(type)
  )
    return { title: 'Error al verificar correo electrónico' }

  return {
    title: 'Error de autenticación',
  }
}

export default async function AuthErrorPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const type = searchParams.type as AuthError | undefined

  if (!type) redirect('/')

  return (
    <section className="container">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4 xl:col-span-4 xl:col-start-5">
          <div className="flex flex-col gap-4">
            <AuthErrorTitle type={type} />
            <AuthErrorDescription type={type} />
          </div>
          <AuthErrorFooter />
        </div>
      </div>
    </section>
  )
}
