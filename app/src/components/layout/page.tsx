import type { ReactNode } from 'react'

export const LayoutPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="flex-1 flex flex-col max-w-7xl px-5 py-5 gap-5">
        {children}
      </div>
    </div>
  )
}
