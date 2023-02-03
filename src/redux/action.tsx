export const SEARCH = "SEARCH";

export const searchAction = (searchResult: any) => ({
  type: SEARCH,
  payload: searchResult,
});
