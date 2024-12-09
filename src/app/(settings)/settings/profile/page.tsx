import { me } from '@/core/actions/auth'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const user = await me()

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
                    {user.first_name}
                  </p>
                </div>
                <Button variant="outline" className="w-fit">
                  Change name
                </Button>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Email</p>
                  <p className="text-base text-muted-foreground md:text-sm">
                    {user.email}
                  </p>
                </div>
                <Button variant="outline" className="w-fit">
                  Change email
                </Button>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none">Password</p>
                  <p className="text-base text-muted-foreground md:text-sm">
                    Change your password to login to your account.
                  </p>
                </div>
                <Button variant="outline" className="w-fit">
                  Change password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
