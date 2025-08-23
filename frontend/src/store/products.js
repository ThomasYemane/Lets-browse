import { csrfFetch } from "./csrf";

// ACTION TYPES
const VIEW_PRODUCTS = 'products/VIEW_PRODUCTS';
const CREATE_PRODUCT = 'products/CREATE_PRODUCTS';
const UPDATE_PRODUCT = 'products/UPDATE_PRODUCTS';
const DELETE_PRODUCT = 'products/DELETE_PRODUCTS';

export const viewProducts = (products) => ({
    type: VIEW_PRODUCTS,
    products
});

export const addProduct = (product) => ({
    type: CREATE_PRODUCT,
    product
});

export const editProduct = (product) => ({
    type: UPDATE_PRODUCT,
    product
});

export const removeProduct = (id) => ({
    type: DELETE_PRODUCT,
    id
});

export const fetchProducts = () => async (dispatch) => {
    const res = await fetch('/api/products/');
    if(res.ok){
        const data = await res.json();
        dispatch(viewProducts(data.products));
    }else{
        const error = await res.json();
        return error;
    }
};

export const createProduct = (data) => async (dispatch) => {
    const res = await csrfFetch('/api/products/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if(res.ok) {
        const newProduct = await res.json();
        dispatch(addProduct(newProduct));
        return newProduct;
    }else{
         const error = await res.json();
        return error;
    }
};

export const updateProduct = (id, data) => async (dispatch) => {
    const res = await csrfFetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (res.ok) {
        const updatedProduct = await res.json();
        dispatch(editProduct(updatedProduct));
        return updatedProduct;
    } else {
        const error = await res.json();
        return error;
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (res.ok) {
        dispatch(removeProduct(id));
    } else {
         const error = await res.json();
        return error;
    }
};

// INITIAL STATE
const initialState = { entries: {}}

// REDUCER
const productsReducer = (state=initialState, action) => {
    switch (action.type) {
        case VIEW_PRODUCTS : {
            const newEntries = {};
            action.products.forEach(product => {
                newEntries[product.id] = product;
            });
            return { ...state, entries: newEntries };
        }
        case CREATE_PRODUCT: {
            return {
                ...state,
                entries: { 
                    ...state.entries, 
                    [action.product.id]: action.product,
                } 
            };
        }
        case UPDATE_PRODUCT: {
            return {
                ...state,
                entries: { 
                    ...state.entries, 
                    [action.product.id]: action.product
                } 
            }
        }
        case DELETE_PRODUCT: {
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

export default productsReducer;


