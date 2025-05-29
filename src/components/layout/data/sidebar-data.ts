import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'OPESSOCIUS',
    email: '',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'OPESSOCIUS',
      logo: Command,
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/user/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Active Investments',
          url: '/user/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Investment Area',
          url: '/user/users',
          icon: IconUsers,
        },
        {
          title: 'Profile',
          url: '/user/profile',
          icon: IconUserCog,
        },
      ],
    },
  ],
}

export const adminSidebarData: SidebarData = {
  user: {
    name: 'OPESSOCIUS',
    email: '',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'OPESSOCIUS',
      logo: Command,
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/admin/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Withdraw Requests',
          url: '/admin/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Web Analytics',
          url: '/admin/apps',
          icon: IconPackages,
        },
        {
          title: 'New Investments',
          url: '/admin/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Total Users',
          url: '/admin/total-users',
          icon: IconUserCog,
        },
        {
          title: 'Create Investment',
          url: '/admin/users',
          icon: IconPackages,
        },
      ],
    },
  ],
}
