import { createContext, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
import { LOGIN, LOGOUT } from './auth-reducer/actions';
import authReducer from './auth-reducer/auth';
import axios from '../utils/axios';
// import SiteLoader from "../components/loader/SiteLoader";
// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  isAdmin: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);

  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| Auth CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const decoded = jwtDecode(serviceToken);
          const user = decoded;
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              isAdmin: user?.user_role === 2,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (user_email, user_pass) => {
    const LoginData = { user_email, user_pass };
    const response = await axios.post('/api/login', LoginData);
    if (response.data.status === 'success') {
      localStorage.setItem('user_email', response.data.data.user_email);
      localStorage.setItem('auth_msg', response.data.message);

      return response.data;
    }
  };

  const getProfileDetails = async () => {
    const response = await axios.get(`/api/user-info`);
    return response.data;
  };

  const verifyOtp = async (otp) => {
    const UserEmail = localStorage.getItem('user_email');
    const OTPData = { otp: otp, email: UserEmail };
    const response = await axios.post('/api/verify-otp', OTPData);
    if (response.data.status === 'success') {
      const { access_token } = response.data.data;
      setSession(access_token);
      const user = jwtDecode(access_token);

      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
      return response.data;
    }
  };
  const resendOtp = async () => {
    const UserEmail = localStorage.getItem('user_email');
    const Data = { userEmail: UserEmail };
    const response = await axios.post('/api/resend-otp', Data);
    return response.data;
  };

  const changePassword = async (data) => {
    const response = await axios.post('/api/change-password', data);
    return response.data;
  };

  const register = async (formData) => {
    const response = await axios.post('/api/account/register', formData);
    return response.data;
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: LOGOUT });
    window.location.href = '/';
  };

  const resetPasswordReq = async (email) => {
    const PasswordResetData = { email: email };
    const response = await axios.post('/api/request-password-reset', PasswordResetData);
    return response.data;
  };
  const resetPassword = async (token, pass) => {
    const UserEmail = localStorage.getItem('user_email');
    const newPasswordData = { token: token, newPassword: pass };
    const response = await axios.post('/api/reset-password', newPasswordData);

    return response.data;
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <p></p>;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        verifyOtp,
        resendOtp,
        logout,
        register,
        getProfileDetails,
        resetPasswordReq,
        resetPassword,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
