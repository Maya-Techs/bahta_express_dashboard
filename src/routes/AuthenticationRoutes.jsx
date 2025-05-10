import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import CodeVerification from '../views/pages/authentication/CodeVerification';
import ResetPassword from '../views/pages/authentication/ResetPassword';
import CheckMailPage from '../views/pages/authentication/CheckMail';
import ChangePassword from '../views/pages/authentication/ChangePassword';
import FORBIDDEN from '../views/errors/403';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('views/pages/authentication/Register')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login',
      element: <LoginPage />
    },
    {
      path: '/pages/register',
      element: <RegisterPage />
    },
    {
      path: '/pages/code-verification',
      element: <CodeVerification />
    },
    {
      path: '/pages/forgot-password',
      element: <ResetPassword />
    },
    {
      path: '/pages/check-mail',
      element: <CheckMailPage />
    },
    {
      path: '/pages/change-password',
      element: <ChangePassword />
    },
    {
      path: '/pages/403',
      element: <FORBIDDEN />
    }
  ]
};

export default AuthenticationRoutes;
