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
import PortfolioListPage from '../views/pages/apps/portfolio/list';
import PostPortfolioPage from '../views/pages/apps/portfolio/post-portfolio';
import EditPortfolioPage from '../views/pages/apps/portfolio/edit-portfolio';

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
        <ProtectedRoute roles={[1]}>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <UtilsTypography />
    },
    {
      path: 'color',
      element: <UtilsColor />
    },
    {
      path: 'shadow',
      element: <UtilsShadow />
    },
    // {
    //   path: '/sample-page',
    //   element: <SamplePage />
    // },
    {
      path: 'user-list',
      element: <Users />
    },
    {
      path: 'blogs',
      element: <BlogListPage />
    },
    {
      path: 'post-blog',
      element: <PostBlogPage />
    },
    {
      path: 'portfolios',
      element: <PortfolioListPage />
    },
    {
      path: 'post-portfolio',
      element: <PostPortfolioPage />
    },
    {
      path: 'edit-blog/:post_id',
      element: <EditBlogPage />
    },
    {
      path: 'edit-portfolio/:post_id',
      element: <EditPortfolioPage />
    },
    {
      path: 'category',
      element: <CategoryListPage />
    },
    {
      path: 'tag',
      element: <TagListPage />
    },
    {
      path: 'client-list',
      element: <ClientListPage />
    },
    {
      path: 'profiles',
      children: [
        {
          path: 'account',
          element: (
            <ProtectedRoute roles={[1]}>
              <AccountProfile />
            </ProtectedRoute>
          ),
          children: [
            {
              path: 'me',
              element: (
                <ProtectedRoute roles={[1]}>
                  <AccountTabProfile />
                  {/* <AccountProfile /> */}
                </ProtectedRoute>
              )
            },
            {
              path: 'change-password',
              element: (
                <ProtectedRoute roles={[1]}>
                  <AccountTabPassword />
                </ProtectedRoute>
              )
            },
            {
              path: 'update-profile',
              element: (
                <ProtectedRoute roles={[1]}>
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
