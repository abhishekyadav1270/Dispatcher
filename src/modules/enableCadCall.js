import { UPDATE_CAD_CALL_FEATURE } from './actions/type'

const initialState = {
    configCadCall: false
}

export default (state = initialState, action) => {
    const cadCallFeatureFetch = action.data;
    switch (action.type) {
        case UPDATE_CAD_CALL_FEATURE  :
            return {
                ...state,
                configCadCall: cadCallFeatureFetch,
            } 
        default:
            return state
    }
}

const actions = {
    updateCadCall: (data) => ({ type: UPDATE_CAD_CALL_FEATURE, data }),
}

export const updateCadCall = (data) => {
    console.log("update cadCallFeatureFetch --->" , data);
    return dispatch => {
        dispatch(actions.updateCadCall(data));
    }
}