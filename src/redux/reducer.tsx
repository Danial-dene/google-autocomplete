import { SEARCH } from "./action";

const initialState = {
  searchResults: [],
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        searchResults: [...state.searchResults, action.payload],
      };
    default:
      return state;
  }
};

export default reducer;
