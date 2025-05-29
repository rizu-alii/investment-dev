import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData as defaultSidebarData } from './data/sidebar-data'

export function AppSidebar({ data = defaultSidebarData, ...props }: { data?: typeof defaultSidebarData } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <button
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
        >
          Logout
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
