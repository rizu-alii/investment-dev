import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import Cookies from 'js-cookie'
import ChatsOriginal from '@/features/chats'
import { sidebarData } from '@/components/layout/data/sidebar-data'

export default function Chats() {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar data={sidebarData} />
        <div className="ml-auto w-full max-w-full peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)] peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))] sm:transition-[width] sm:duration-200 sm:ease-linear flex h-svh flex-col group-data-[scroll-locked=1]/body:h-full has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh">
          {/* ===== Top Heading ===== */}
          <Header>
            <TopNav links={topNav} />
            <div className='ml-auto flex items-center space-x-4'>
              <Search />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>

          {/* ===== Main ===== */}
          <Main>
            <div className='mb-2 flex items-center justify-between space-y-2'>
              <h1 className='text-2xl font-bold tracking-tight'>User Chats</h1>
              <div className='flex items-center space-x-2'>
                <Button>New Chat</Button>
              </div>
            </div>
            {/* Add your chats content here */}
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

const topNav = [
  {
    title: 'Direct Messages',
    href: 'chats/direct',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Group Chats',
    href: 'chats/groups',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Channels',
    href: 'chats/channels',
    isActive: false,
    disabled: false,
  },
] 