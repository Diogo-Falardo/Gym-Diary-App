import { useEffect, useState } from 'react'
import { LayoutPage } from '#/components/layout/page'
import HeaderUser from '#/integrations/clerk/header-user'
import { useAuth } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { sfIndexUser } from '#/server/users/user.function'
import { ModeToggle } from '#/components/theme/mode-toogle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { ProfileUpdater } from '#/components/profile/profile-updater'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { isSignedIn, userId } = useAuth()
  const [internalUserId, setInteralUserid] = useState<string>('')

  const indexUser = useServerFn(sfIndexUser)

  useEffect(() => {
    if (isSignedIn && typeof userId === 'string') {
      const indexUserId = async () => {
        const id = await indexUser({ data: { clerkId: userId } })
        setInteralUserid(id)
      }
      indexUserId()
    }
  }, [isSignedIn, userId, indexUser])

  console.log({
    page: 'index',
    userId: internalUserId,
  })

  return (
    <LayoutPage>
      <div className="flex justify-between items-center">
        <h1>Gym Diary</h1>
        <div className="flex items-center gap-3">
          <HeaderUser />
          <ModeToggle />
        </div>
      </div>
      <div className="flex justify-center">
        <Tabs defaultValue="diary" className="w-full">
          <TabsList className="">
            <TabsTrigger value="diary">Diary</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="diary"></TabsContent>
          <TabsContent value="profile" className="">
            <ProfileUpdater userId={internalUserId} />
          </TabsContent>
        </Tabs>
      </div>
    </LayoutPage>
  )
}
