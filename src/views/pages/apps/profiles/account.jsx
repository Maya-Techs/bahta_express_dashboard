import { useEffect, useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project-imports
import MainCard from '../../../../ui-component/MainCard';
import Breadcrumbs from '../../../../ui-component/extended/Breadcrumbs';

// assets
import { IconLock, IconUser, IconUserEdit } from '@tabler/icons-react';

// ==============================|| PROFILE - ACCOUNT ||============================== //

export default function AccountProfile() {
  const { pathname } = useLocation();

  let selectedTab = 0;
  let breadcrumbTitle = '';
  let breadcrumbHeading = '';
  switch (pathname) {
    case '/profiles/account/password':
      breadcrumbTitle = 'Change Password';
      breadcrumbHeading = 'Change Password';
      selectedTab = 2;
      break;
    case '/profiles/account/edit-profile':
      breadcrumbTitle = 'Edit Profile';
      breadcrumbHeading = 'Edit Profile';
      selectedTab = 1;
      break;
    case '/profiles/account/me':
    default:
      breadcrumbTitle = 'Basic';
      breadcrumbHeading = 'Account';
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let breadcrumbLinks = [
    { title: 'Home', to: '/' },
    { title: 'Account Profile', to: '/profiles/account/me' },
    { title: breadcrumbTitle }
  ];
  if (selectedTab === 0) {
    breadcrumbLinks = [{ title: 'Home', to: '/' }, { title: 'Account Profile' }];
  }

  useEffect(() => {
    if (pathname === '/profiles/account/me') {
      setValue(0);
    } else if (pathname === '/profiles/account/update-profile') {
      setValue(1);
    } else if (pathname === '/profiles/account/change-password') {
      setValue(2);
    }
  }, [pathname]);

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <MainCard border={false}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
            <Tab label="Profile" component={Link} to="/profiles/account/me" icon={<IconUser />} iconPosition="start" />
            <Tab label="Edit Profile" component={Link} to="/profiles/account/update-profile" icon={<IconUserEdit />} iconPosition="start" />
            <Tab label="Change Password" component={Link} to="/profiles/account/change-password" icon={<IconLock />} iconPosition="start" />
          </Tabs>
        </Box>
        <Box sx={{ mt: 2.5 }}>
          <Outlet />
        </Box>
      </MainCard>
    </>
  );
}
