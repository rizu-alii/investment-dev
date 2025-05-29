import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Suspense } from 'react';

// Lazy load homemodule pages
const Home = lazy(() => import('./homemodule/HomePage'));
const About = lazy(() => import('./homemodule/AboutPage'));
const Contact = lazy(() => import('./homemodule/ContactPage'));
const Calculator = lazy(() => import('./homemodule/CalculatorSinglePage'));
const Blog = lazy(() => import('./homemodule/BlogPage'));
const BlogDetail = lazy(() => import('./homemodule/BlogDetailPage'));

// Auth routes
const SignIn = lazy(() => import('./routes/(auth)/sign-in'));
const SignUp = lazy(() => import('./routes/(auth)/sign-up'));
const SignIn2 = lazy(() => import('./routes/(auth)/sign-in-2'));
const ForgotPassword = lazy(() => import('./routes/(auth)/forgot-password'));
const Otp = lazy(() => import('./routes/(auth)/otp'));

// Error routes
const Error404 = lazy(() => import('./routes/(errors)/404'));
const Error500 = lazy(() => import('./routes/(errors)/500'));
const Error401 = lazy(() => import('./routes/(errors)/401'));
const Error403 = lazy(() => import('./routes/(errors)/403'));
const Error503 = lazy(() => import('./routes/(errors)/503'));

// Admin routes
const AdminDashboard = lazy(() => import('./adminmodule/dashboard/index'));
const AdminTotalUsers = lazy(() => import('./adminmodule/total-users'));
const AdminTasks = lazy(() => import('./adminmodule/tasks'));
const AdminChats = lazy(() => import('./routes/admin/chats'));
const AdminUserHistory = lazy(() => import('./adminmodule/user-history'));
const AdminLogin = lazy(() => import('./authmodule/adminlogin/index'));
const AdminInvestments = lazy(() => import('./adminmodule/createInvestment'));
const AdminAppsAnalytics = lazy(() => import('./adminmodule/webanalysis'));
const AdminUserEdit = lazy(() => import('./routes/admin/user-edit'));
const AdminUserProfile = lazy(() => import('./routes/admin/user-profile'));

// User routes
const UserDashboard = lazy(() => import('./usermodule/dashboard/UserDashboard'));
const UserProfile = lazy(() => import('./usermodule/profile/index'));
// const UserInvestments = lazy(() => import('./user/users/components/InvestmentsVisualization'));
// const UserInvestedCards = lazy(() => import('./user/tasks/components/InvestedCards'));
// const UserInvestmentDetail = lazy(() => import('./user/tasks/components/InvestmentDetail'));
// const UserSettings = lazy(() => import('./routes/user/settings'));
// const UserApps = lazy(() => import('./routes/user/apps'));
// const UserTasks = lazy(() => import('./routes/user/tasks'));
// const UserChats = lazy(() => import('./routes/user/chats'));
const UserActiveInvestments = lazy(() => import('./usermodule/activeInvestment/index'));
const UserInvestmentArea = lazy(() => import('./usermodule/all-available-investments/index'));


// _authenticated routes
const AuthenticatedDashboard = lazy(() => import('./routes/_authenticated/dashboard'));
const AuthenticatedApps = lazy(() => import('./routes/_authenticated/apps/index'));
const AuthenticatedChats = lazy(() => import('./routes/_authenticated/chats/index'));
const AuthenticatedHelpCenter = lazy(() => import('./routes/_authenticated/help-center/index'));
const AuthenticatedSettings = lazy(() => import('./routes/_authenticated/settings/index'));
const AuthenticatedSettingsAppearance = lazy(() => import('./routes/_authenticated/settings/appearance'));
const AuthenticatedSettingsAccount = lazy(() => import('./routes/_authenticated/settings/account'));
const AuthenticatedSettingsDisplay = lazy(() => import('./routes/_authenticated/settings/display'));
const AuthenticatedSettingsNotifications = lazy(() => import('./routes/_authenticated/settings/notifications'));
const AuthenticatedTasks = lazy(() => import('./routes/_authenticated/tasks/index'));
const AuthenticatedUsers = lazy(() => import('./routes/_authenticated/users/index'));

// function UserInvestmentDetailWrapper() {
//   const navigate = useNavigate();
//   const investment = { id: 1 };
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <UserInvestmentDetail investment={investment} onBack={() => navigate(-1)} />
//     </Suspense>
//   );
// }

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/calculator', element: <Calculator /> },
  { path: '/blog', element: <Blog /> },
  { path: '/blog/:id', element: <BlogDetail /> },
  // Auth routes
  { path: '/sign-in', element: <SignIn /> },
  { path: '/sign-in-2', element: <SignIn2 /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/otp', element: <Otp /> },
  // Error routes
  { path: '/404', element: <Error404 /> },
  { path: '/500', element: <Error500 /> },
  { path: '/401', element: <Error401 /> },
  { path: '/403', element: <Error403 /> },
  { path: '/503', element: <Error503 /> },
  // Admin routes
  {
    path: '/admin',
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'total-users', element: <AdminTotalUsers /> },
      { path: 'tasks', element: <AdminTasks /> },
      { path: 'chats', element: <AdminChats /> },
      { path: 'user-history', element: <AdminUserHistory /> },
      { path: 'user-history/:userId', element: <AdminUserHistory /> },
      { path: 'login', element: <AdminLogin /> },
      { path: 'users', element: <AdminInvestments /> },
      { path: 'apps', element: <AdminAppsAnalytics /> },
      { path: 'user-edit', element: <AdminUserEdit /> },
      { path: 'user-profile', element: <AdminUserProfile /> },
    ],
  },
  // User routes
  {
    path: '/user',
    children: [
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'profile', element: <UserProfile /> },
      // { path: 'investments', element: <UserInvestments /> },
      // { path: 'invested-cards', element: <UserInvestedCards /> },
      // { path: 'investment/:id', element: <UserInvestmentDetailWrapper /> },
      // { path: 'settings', element: <UserSettings /> },
      // { path: 'apps', element: <UserApps /> },
      // { path: 'tasks', element: <UserTasks /> },
      // { path: 'chats', element: <UserChats /> },
      { path: 'tasks', element: <UserActiveInvestments /> },
      { path: 'users', element: <UserInvestmentArea /> },
      // { path: 'users', element: <UserUsers /> },
    ],
  },
  // _authenticated routes
  {
    path: '/_authenticated',
    children: [
      { path: 'dashboard', element: <AuthenticatedDashboard /> },
      { path: 'apps', element: <AuthenticatedApps /> },
      { path: 'chats', element: <AuthenticatedChats /> },
      { path: 'help-center', element: <AuthenticatedHelpCenter /> },
      {
        path: 'settings',
        children: [
          { path: '', element: <AuthenticatedSettings /> },
          { path: 'appearance', element: <AuthenticatedSettingsAppearance /> },
          { path: 'account', element: <AuthenticatedSettingsAccount /> },
          { path: 'display', element: <AuthenticatedSettingsDisplay /> },
          { path: 'notifications', element: <AuthenticatedSettingsNotifications /> },
        ],
      },
      { path: 'tasks', element: <AuthenticatedTasks /> },
      { path: 'users', element: <AuthenticatedUsers /> },
    ],
  },
]); 