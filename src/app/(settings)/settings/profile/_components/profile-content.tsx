'use client'

import { useAuth } from '@/core/hooks/auth'
import { Separator } from '@/components/ui/separator'
import { ProfileName } from './profile-name'
import { ProfileEmail } from './profile-email'
import { ProfilePassword } from './profile-password'

export function ProfileContent() {
  const { user } = useAuth()

  return (
    <div className="@container mx-auto my-4 grid size-full max-w-7xl grid-cols-12 gap-6 px-4 lg:my-6">
      <div className="col-span-12 @md:col-span-10 @md:col-start-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
            <p className="text-muted-foreground text-sm">
              Manage your profile details.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
              <div className="space-y-2">
                <p className="text-sm leading-none font-medium">Name</p>
                <p className="text-muted-foreground text-base md:text-sm">
                  {user.name}
                </p>
              </div>
              <ProfileName />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
              <div className="space-y-2">
                <p className="text-sm leading-none font-medium">Email</p>
                <p className="text-muted-foreground text-base md:text-sm">
                  {user.email}
                </p>
              </div>
              <ProfileEmail />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:justify-between">
              <div className="space-y-2">
                <p className="text-sm leading-none font-medium">Password</p>
                <p className="text-muted-foreground text-base md:text-sm">
                  Change your password to login to your account.
                </p>
              </div>
              <ProfilePassword />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
