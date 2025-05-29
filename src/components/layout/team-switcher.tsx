import * as React from 'react'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan?: string
  }[]
}) {
  const activeTeam = teams[0]
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-4 py-2 select-none cursor-default">
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
            <activeTeam.logo className='size-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-bold'>{activeTeam.name}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
