import { csrfFetch } from "./csrf";

// ACTION TYPES
const VIEW_WISHLIST = 'wishlist/VIEW';
const ADD_WISHLIST = 'wishlist/ADD';
const REMOVE_WISHLIST = 'wishlist/REMOVE';

export const viewWishlist = (wishlists) => ({
    type: VIEW_WISHLIST,
    wishlists
});

export const addWishlist = (wishlist) => ({
    type: ADD_WISHLIST,
    wishlist
});

export const removeWishlist = (id) => ({
    type: REMOVE_WISHLIST,
    id
});

export const fetchWishlists = () => async (dispatch) => {
    const res = await csrfFetch('/api/wishlist/');
    if(res.ok){
        const data = await res.json();
        dispatch(viewWishlist(data.wishlist));
    }else{
         const error = await res.json();
        return error;
    }
};

export const createWishlist = (data) => async (dispatch) => {
    const res = await csrfFetch('/api/wishlist/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if(res.ok) {
        const newWishlist = await res.json();
        dispatch(addWishlist(newWishlist));
        return newWishlist;
    }else{
         const error = await res.json();
        return error;
    }
};

export const deleteWishlist = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (res.ok) {
        dispatch(removeWishlist(id));
    } else {
         const error = await res.json();
        return error;
    }
};

// INITIAL STATE
const initialState = { entries: {}}

// REDUCER
const wishlistReducer = (state=initialState, action) => {
    switch (action.type) {
        case VIEW_WISHLIST : {
            const newEntries = {};
            action.wishlists.forEach(wishlist => {
                newEntries[wishlist.id] = wishlist;
            });
            return { ...state, entries: newEntries };
        }
        case ADD_WISHLIST: {
            return {
                ...state,
                entries: { 
                    ...state.entries, 
                    [action.wishlist.id]: action.wishlist,
                } 
            };
        }
        case REMOVE_WISHLIST: {
            const newEntries = { ...state.entries };
            delete newEntries[action.id];
            return { 
            ...state, 
            entries: newEntries
      };
        }
        default:
            return state;
    }
};

export default wishlistReducer;


