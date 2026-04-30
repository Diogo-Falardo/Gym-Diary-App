import { Button } from '@/components/ui/button'
import {
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
  SignUpButton,
} from '@clerk/clerk-react'

export default function HeaderUser() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <div className="flex gap-2 items-center">
          <Button asChild>
            <SignInButton />
          </Button>
          <Button asChild>
            <SignUpButton />
          </Button>
        </div>
      </SignedOut>
    </>
  )
}
