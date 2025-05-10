// assets
import {
  IconKey,
  IconArticle,
  IconBriefcase,
  IconUserSquareRounded,
  IconCategory,
  IconTag,
  IconUsers,
  IconUserCog,
  IconHome
} from '@tabler/icons-react';

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
  IconHome
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
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
      id: 'portfolio',
      title: 'Portfolios',
      type: 'collapse',
      icon: icons.IconBriefcase,
      children: [
        {
          id: 'add-portfolio',
          title: 'Add Portfolio',
          type: 'item',
          url: '/post-portfolio',
          target: false
        },
        {
          id: 'portfolio-list',
          title: 'portfolio List',
          type: 'item',
          url: '/portfolios',
          target: false
        }
      ]
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

export default pages;
