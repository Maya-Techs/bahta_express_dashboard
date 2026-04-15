import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Users from '../views/pages/apps/users/list';
import ProtectedRoute from './ProtectedRoute';
import FORBIDDEN from '../views/errors/403';
import AccountProfile from '../views/pages/apps/profiles/account';
import AccountTabProfile from '../components/profiles/TabProfile';
import AccountTabPassword from '../components/profiles/TabPassword';
import AccountTabUpdateProfile from '../components/profiles/TabUpdateProfile';
import CategoryListPage from '../views/pages/apps/category/list';
import TagListPage from '../views/pages/apps/tag/list';
import ClientListPage from '../views/pages/apps/client/list';
import BlogListPage from '../views/pages/apps/blog/list';
import PostBlogPage from '../views/pages/apps/blog/post-blog';
import EditBlogPage from '../views/pages/apps/blog/edit-blog';
import ServiceList from '../views/pages/apps/service/list';
import ServiceListPage from '../views/pages/apps/service/list';
import QuotesListPage from '../views/pages/apps/quote/list';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute roles={[2, 1]}>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <ProtectedRoute roles={[2, 1]}>
              <DashboardDefault />
            </ProtectedRoute>
          )
        }
      ]
    },
    {
      path: 'user-list',
      element: (
        <ProtectedRoute roles={[2]}>
          <Users />
        </ProtectedRoute>
      )
    },
    {
      path: 'service-list',
      element: (
        <ProtectedRoute roles={[2]}>
          <ServiceListPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'blogs',
      element: (
        <ProtectedRoute roles={[2]}>
          <BlogListPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'post-blog',
      element: (
        <ProtectedRoute roles={[2]}>
          <PostBlogPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'quote-list',
      element: (
        <ProtectedRoute roles={[2, 1]}>
          <QuotesListPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'edit-blog/:post_id',
      element: (
        <ProtectedRoute roles={[2]}>
          <EditBlogPage />
        </ProtectedRoute>
      )
    },

    {
      path: 'category',
      element: (
        <ProtectedRoute roles={[2]}>
          <CategoryListPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'tag',
      element: (
        <ProtectedRoute roles={[2]}>
          <TagListPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'client-list',
      element: (
        <ProtectedRoute roles={[2, 1]}>
          <ClientListPage />
        </ProtectedRoute>
      )
    },
    {
      path: 'profiles',
      children: [
        {
          path: 'account',
          element: (
            <ProtectedRoute roles={[2, 1]}>
              <AccountProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              path: 'me',
              element: (
                <ProtectedRoute roles={[2, 1]}>
                  <AccountTabProfile />
                  {/* <AccountProfile /> */}
                </ProtectedRoute>
              )
            },
            {
              path: 'change-password',
              element: (
                <ProtectedRoute roles={[2, 1]}>
                  <AccountTabPassword />
                </ProtectedRoute>
              )
            },
            {
              path: 'update-profile',
              element: (
                <ProtectedRoute roles={[2, 1]}>
                  <AccountTabUpdateProfile />
                </ProtectedRoute>
              )
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
