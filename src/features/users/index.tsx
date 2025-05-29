import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { userListSchema } from './data/schema'
import { users } from './data/users'
import { InvestmentsVisualization } from "./components/InvestmentsVisualization";

export default function Users() {
  // Parse user list
  const userList = userListSchema.parse(users)
  // Mock authentication
  const isAuthenticated = true;

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        {/* General Information Section */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Investments Area</h3>
          <p className="text-muted-foreground">Welcome to the Investments section. Here you can view and manage all your active investments. This area can be customized according to client guidelines.</p>
        </div>
        {/* Dynamic Investment Visualization (Authenticated users only) */}
        {isAuthenticated && (
          <div className="mb-8">
            <InvestmentsVisualization />
          </div>
        )}
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable data={userList} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
