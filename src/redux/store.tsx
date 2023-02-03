import { Reducer } from "redux";
import { legacy_createStore as createStore } from "redux";

const initialState = {
  searchResults: [],
};

const reducer: Reducer<{ searchResults: any[] }, any> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "ADD_SEARCH_RESULT":
      return {
        ...state,
        searchResults: [...state.searchResults, action.payload],
      };
    default:
      return state;
  }
};

export const store = createStore(reducer);
