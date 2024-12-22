'use client'

import { createContext, use, useContext, useMemo } from 'react'
import { type User } from '@/core/types'

type ProfileContextType = {
  user: User
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export function useProfile() {
  const context = useContext(ProfileContext)

  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }

  return context
}

export function ProfileProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<User>
  children: React.ReactNode
}) {
  const user = use(userPromise)
  const value = useMemo(
    () => ({
      user,
    }),
    [user],
  )

  return <ProfileContext value={value}>{children}</ProfileContext>
}
