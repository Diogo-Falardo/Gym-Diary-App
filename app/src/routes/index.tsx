import { useEffect, useState } from 'react'
import { LayoutPage } from '#/components/layout/page'
import HeaderUser from '#/integrations/clerk/header-user'
import { useAuth } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { sfIndexUser } from '#/server/users/user.function'

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
      <div className="flex justify-between items-center py-5">
        <h1>Welcome to the #1 gym diary app</h1>
        <HeaderUser />
      </div>
    </LayoutPage>
  )
}
