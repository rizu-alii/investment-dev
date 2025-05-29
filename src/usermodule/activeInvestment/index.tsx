import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import Cookies from 'js-cookie'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import { InvestedCards } from './components/InvestedCards'

export default function Tasks() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar data={sidebarData} />
        <div className="ml-auto w-full max-w-full flex h-svh flex-col">
          <Header fixed>
            {/* <Search /> */}
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          <Main>
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Your Investments</h3>
              <p className="text-muted-foreground">These are the investments you have already made. Click 'Details' to view more information about each investment.</p>
            </div>
            <InvestedCards />
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
} 