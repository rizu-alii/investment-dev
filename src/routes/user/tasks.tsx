import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { sidebarData } from '@/components/layout/data/sidebar-data'
import UserTasks from '@/features/tasks'

export default function UserTasksWithSidebar() {
  return (
    <SearchProvider>
      <SidebarProvider>
        <AppSidebar data={sidebarData} />
        <div className="ml-auto w-full max-w-full flex h-svh flex-col">
          <Header>
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          <Main>
            <UserTasks />
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
} 