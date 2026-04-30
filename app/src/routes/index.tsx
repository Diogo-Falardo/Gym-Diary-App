import { LayoutPage } from '#/components/layout/page'
import { Button } from '#/components/ui/button'
import HeaderUser from '#/integrations/clerk/header-user'
import { useAuth } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { isSignedIn, userId } = useAuth()
  console.log(isSignedIn, userId)
  return (
    <LayoutPage>
      <div className="flex justify-between items-center py-5">
        <h1>Welcome to the #1 gym diary app</h1>
        <HeaderUser />
      </div>
    </LayoutPage>
  )
}
