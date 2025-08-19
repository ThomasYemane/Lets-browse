// frontend/src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sessionReducer from './session';
import productsReducer from './products';
import categoriesReducer from './categories';

const rootReducer = combineReducers({
   session: sessionReducer,
   products: productsReducer,
   categories : categoriesReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
