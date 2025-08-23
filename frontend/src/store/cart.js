import { csrfFetch } from "./csrf";

// ACTION TYPES
const VIEW_CART = 'cart/VIEW';
const ADD_CART = 'cart/ADD';
const REMOVE_CART = 'cart/REMOVE';

export const viewCart = (items) => ({
    type: VIEW_CART,
    items
});

export const addItem = (item) => ({
    type: ADD_CART,
    item
});

export const removeItem = (id) => ({
    type: REMOVE_CART,
    id
});

export const fetchCart = () => async (dispatch) => {
    const res = await csrfFetch('/api/cart/');
    if(res.ok){
        const data = await res.json();
        dispatch(viewCart(data.items));
    }else{
         const error = await res.json();
        return error;
    }
};

export const addToCart = (data) => async (dispatch) => {
    const res = await csrfFetch('/api/cart/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if(res.ok) {
        const item = await res.json();
        dispatch(addItem(item));
        return item;
    }else{
         const error = await res.json();
        return error;
    }
};

export const removeFromCart = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (res.ok) {
        dispatch(removeItem(id));
    } else {
         const error = await res.json();
        return error;
    }
};

// INITIAL STATE
const initialState = { entries: {}}

// REDUCER
const cartReducer = (state=initialState, action) => {
    switch (action.type) {
        case VIEW_CART : {
            const newEntries = {};
            action.items.forEach(item => {
                newEntries[item.id] = item;
            });
            return { ...state, entries: newEntries };
        }
        case ADD_CART: {
            return {
                ...state,
                entries: { 
                    ...state.entries, 
                    [action.cart.id]: action.cart,
                } 
            };
        }
        case REMOVE_CART: {
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

export default cartReducer;


