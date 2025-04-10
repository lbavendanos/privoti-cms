'use client'

import { getUser } from '@/core/actions/new/auth'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator'
import { ProfileName } from './profile-name'
import { ProfileEmail } from './profile-email'
import { ProfilePassword } from './profile-password'

export function ProfileContent() {
  const { data: user } = useSuspenseQuery({
    queryKey: ['auth'],
    queryFn: () => getUser(),
    retry: false,
  })

  return (
    <div className="container my-4 lg:my-6">
      <div className="grid h-full grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-lg font-semibold md:text-2xl">Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your profile details.
              </p>
            </div>
            <Separator />
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Name</p>
                  <p className="text-base text-muted-foreground md:text-sm">
                    {user.name}
                  </p>
                </div>
                <ProfileName />
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Email</p>
                  <p className="text-base text-muted-foreground md:text-sm">
                    {user.email}
                  </p>
                </div>
                {/* <ProfileEmail /> */}
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Password</p>
                  <p className="text-base text-muted-foreground md:text-sm">
                    Change your password to login to your account.
                  </p>
                </div>
                {/* <ProfilePassword /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
