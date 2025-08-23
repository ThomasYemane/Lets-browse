// ACTION TYPES
const VIEW_CATEGORIES = 'categories/VIEW_CATEGORIES';

export const viewCategories = (categories) => ({
    type: VIEW_CATEGORIES,
    categories,
});


export const fetchCategories = () => async (dispatch) => {
    const res = await fetch('/api/categories/');
    if(res.ok){
        const data = await res.json();
        dispatch(viewCategories(data.categories));
    }else{
        
        console.error("Failed to fetch categories");
    }
};

// INITIAL STATE
const initialState = { entries: {}}

// REDUCER
const categoriesReducer = (state=initialState, action) => {
    switch (action.type) {
        case VIEW_CATEGORIES : {
            const newEntries = {};
            action.categories.forEach(category => {
                newEntries[category.id] = category;
            });
            return { ...state, entries: newEntries };
        }
        default:
            return state;
    }
};

export default categoriesReducer;
