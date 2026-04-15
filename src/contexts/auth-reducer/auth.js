// action - state management
import { REGISTER, LOGIN, LOGOUT } from "./actions";

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  isAdmin: false,
  user: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user,
      };
    }
    case LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        isAdmin: user?.user_role === 2,
        user,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        isAdmin: false,
        user: null,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
