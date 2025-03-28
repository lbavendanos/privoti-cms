import { getUser } from '@/core/actions/auth'
import { getSessionToken } from '@/lib/session'
import type { Metadata } from 'next'
import { ProfileProvider } from './_components/profile-context'
import { ProfileContent } from './_components/profile-content'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage() {
  const sessionToken = await getSessionToken()
  const userPromise = getUser(sessionToken!)

  return (
    <ProfileProvider userPromise={userPromise}>
      <ProfileContent />
    </ProfileProvider>
  )
}
