import type { ReactNode } from 'react'

export const LayoutPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex-1 flex flex-col max-w-7xl">{children}</div>
    </div>
  )
}
