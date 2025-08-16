// frontend/src/store/session.js
import { csrfFetch } from './csrf';
import { createSlice } from '@reduxjs/toolkit';

const initialState = { user: null };

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload; // { id, email, username, firstName, lastName } or null
    },
    removeUser(state) {
      state.user = null;
    }
  }
});

export const { setUser, removeUser } = sessionSlice.actions;

/** POST /api/session */
export const login = ({ credential, password }) => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ credential, password })
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

/** GET /api/session */
export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch('/api/session');
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

// SIGNUP thunk
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({ username, firstName, lastName, email, password })
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};


export default sessionSlice.reducer;
