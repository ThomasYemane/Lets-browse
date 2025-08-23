// frontend/src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionReducer from './session';
import productsReducer from './products';
import categoriesReducer from './categories';
import wishlistReducer from './wishlist';
import reviewsReducer from './reviews';
import cartReducer from './cart';


const rootReducer = combineReducers({
   session: sessionReducer,
   products: productsReducer,
   categories : categoriesReducer,
   wishlist: wishlistReducer,
   reviews: reviewsReducer,
   cart: cartReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
