'use client'

import { createContext, useContext, useMemo } from 'react'
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
  user,
  children,
}: {
  user: User
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({
      user,
    }),
    [user],
  )

  return <ProfileContext value={value}>{children}</ProfileContext>
}
