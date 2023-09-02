import { UPDATE_DGNA_FEATURE } from "./actions/type";
const initialState = {
  configDGNA: false,
};

export default (state = initialState, action) => {
  const dgnaFetch = action.data;
  switch (action.type) {
    case UPDATE_DGNA_FEATURE:
      return {
        ...state,
        configDGNA: dgnaFetch,
      };
    default:
      return state;
  }
};

const actions = {
  updateDGNA: (data) => ({ type: UPDATE_DGNA_FEATURE, data }),
};

export const updateDGNA = (data) => {
  return (dispatch) => {
    dispatch(actions.updateDGNA(data));
  };
};
