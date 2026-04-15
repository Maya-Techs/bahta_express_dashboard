// assets
import React from 'react'; // Import React if necessary

import {
  IconKey,
  IconArticle,
  IconBriefcase,
  IconUserSquareRounded,
  IconCategory,
  IconTag,
  IconUsers,
  IconUserCog,
  IconHome,
  IconListCheck,
  IconTruckDelivery
} from '@tabler/icons-react';
import { jwtDecode } from 'jwt-decode';

// constant
const icons = {
  IconKey,
  IconArticle,
  IconBriefcase,
  IconUserSquareRounded,
  IconCategory,
  IconTag,
  IconUsers,
  IconUserCog,
  IconHome,
  IconListCheck,
  IconTruckDelivery
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const adminMenu = {
  id: 'apps',
  title: 'Apps',
  caption: '',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'home',
      title: 'Home',
      type: 'item',
      url: 'https://bahtaexpress.com/',
      icon: icons.IconHome,
      external: true,
      target: true
    },

    {
      id: 'quote',
      title: 'Quotes',
      type: 'item',
      url: '/quote-list',
      icon: icons.IconTruckDelivery,
      breadcrumbs: false
    },
    {
      id: 'service',
      title: 'Services',
      type: 'item',
      url: '/service-list',
      icon: icons.IconListCheck,
      breadcrumbs: false
    },
    {
      id: 'client',
      title: 'Clients',
      type: 'item',
      url: '/client-list',
      icon: icons.IconUserSquareRounded,
      breadcrumbs: false
    },
    {
      id: 'blogs',
      title: 'Blogs',
      type: 'collapse',
      icon: icons.IconArticle,
      children: [
        {
          id: 'create-blog',
          title: 'Post Blog',
          type: 'item',
          url: '/post-blog',
          target: false
        },
        {
          id: 'blog-list',
          title: 'Blog List',
          type: 'item',
          url: '/blogs',
          target: false
        }
      ]
    },

    //

    {
      id: 'user',
      title: 'Users',
      type: 'item',
      url: '/user-list',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'category',
      title: 'Categories',
      type: 'item',
      url: '/category',
      icon: icons.IconCategory,
      breadcrumbs: false
    },
    {
      id: 'tag',
      title: 'Tag',
      type: 'item',
      url: '/tag',
      icon: icons.IconTag,
      breadcrumbs: false
    },
    {
      id: 'account',
      title: 'Account',
      type: 'item',
      url: '/profiles/account/me',
      icon: icons.IconUserCog,
      breadcrumbs: false
    }
  ]
};
const employeeMenu = {
  id: 'apps',
  title: 'Apps',
  caption: '',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'home',
      title: 'Home',
      type: 'item',
      url: 'https://bahtaexpress.com/',
      icon: icons.IconHome,
      external: false,
      target: false
    },
    {
      id: 'quote',
      title: 'Quotes',
      type: 'item',
      url: '/quote-list',
      icon: icons.IconTruckDelivery,
      breadcrumbs: false
    },
    {
      id: 'account',
      title: 'Account',
      type: 'item',
      url: '/profiles/account/me',
      icon: icons.IconUserCog,
      breadcrumbs: false
    }
  ]
};

const serviceToken = localStorage.getItem('serviceToken');
let decoded = null;

if (serviceToken && typeof serviceToken === 'string') {
  try {
    decoded = jwtDecode(serviceToken);
  } catch (error) {
    console.error('Invalid token:', error);
  }
}

const pages = decoded && decoded.user_role === 2 ? adminMenu : employeeMenu;

export default pages;
