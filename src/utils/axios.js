import axios from 'axios';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL
});

//  AXIOS  SERVICES  //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['x-access-token'] = `${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/maintenance/500';
    }

    // if (error.response.status === 403) {
    //   const errorMessage = error.response.data.error || error.response.data.message;

    // }
    if (error.response.status === 403) {
      // Handle 403 errors for subscription checks
      const errorMessage = error.response.data.error || error.response.data.message;
      if (errorMessage.includes('subscription') || errorMessage.includes('subscription')) {
        // Redirect to the subscription renewal page
        window.location.href = '/maintenance/subscription-expired';
      }
      if (errorMessage.includes('inactive') || errorMessage.includes('subscription')) {
        // Redirect to the subscription renewal page
        window.location.href = '/maintenance/account-inactivated';
      }
      if (errorMessage.includes('not allowed') || errorMessage.includes('not from your company')) {
        // Redirect to the subscription renewal page
        window.location.href = '/maintenance/403';
      }
    }
    // Handle 500 error (INTERNAL SERVER ERROR)
    // if (error.response.status === 500) {
    //   const errorMessage = error.response.data.error;
    //   if (errorMessage.includes('Internal') || errorMessage.includes('Server Error')) {
    //     // Redirect to the subscription renewal page
    //     window.location.href = '/maintenance/500';
    //   }
    //   if (errorMessage.includes('Internal') || errorMessage.includes('Server Error')) {
    //     // Redirect to the subscription renewal page
    //     window.location.href = '/maintenance/500';
    //   }
    // }

    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
