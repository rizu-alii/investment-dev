import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import Cookies from 'js-cookie'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import { InvestmentsVisualization } from "./InvestmentsVisualization";

export default function Users() {
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
            {/* General Information Section */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Investments Area</h3>
              <p className="text-muted-foreground">
                Welcome to the Investments section. Here you can view and manage all your active investments. This area can be customized according to client guidelines.
              </p>
            </div>
            {/* Dynamic Investment Visualization */}
            <InvestmentsVisualization />
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

