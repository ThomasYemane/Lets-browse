import { csrfFetch } from "./csrf";

// ACTION TYPES
const VIEW_REVIEWS = 'reviews/VIEW';
const CREATE_REVIEW = 'products/ADD';
const UPDATE_REVIEW = 'products/EDIT';
const DELETE_REVIEW = 'products/REMOVE';

export const viewReviews = (reviews) => ({
    type: VIEW_REVIEWS,
    reviews
});

export const addReview = (review) => ({
    type: CREATE_PRODUCT,
    review
});

export const editReview = (review) => ({
    type: UPDATE_REVIEW,
    review
});

export const removeReview = (id) => ({
    type: DELETE_REVIEW,
    id
});

export const fetchReviews = (productId) => async (dispatch) => {
    const res = await csrfFetch('/api/reviews//product/'+productId);
    if(res.ok){
        const data = await res.json();
        dispatch(viewReviews(data.reviews));
    }else{
         const error = await res.json();
        return error;
    }
};

export const createReview = (data) => async (dispatch) => {
    const res = await csrfFetch('/api/reviews/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if(res.ok) {
        const newReview = await res.json();
        dispatch(addReview(newReview));
        return newReview;
    }else{
         const error = await res.json();
        return error;
    }
};

export const updateReview = (id, data) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (res.ok) {
        const updatedReview = await res.json();
        dispatch(editReview(updatedReview));
        return updatedReview;
    } else {
         const error = await res.json();
        return error;
    }
};

export const deleteReview = (id) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (res.ok) {
        dispatch(removeReview(id));
    } else {
         const error = await res.json();
        return error;
    }
};

// INITIAL STATE
const initialState = { entries: {}}

// REDUCER
const reviewsReducer = (state=initialState, action) => {
    switch (action.type) {
        case VIEW_REVIEWS : {
            const newEntries = {};
            action.reviews.forEach(review => {
                newEntries[review.id] = review;
            });
            return { ...state, entries: newEntries };
        }
        case CREATE_REVIEW: {
            return {
                ...state,
                entries: { 
                    ...state.entries, 
                    [action.review.id]: action.review,
                } 
            };
        }
        case UPDATE_REVIEW: {
            return {
                ...state,
                entries: { 
                    ...state.entries, 
                    [action.review.id]: action.review
                } 
            }
        }
        case DELETE_REVIEW: {
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

export default reviewsReducer;


