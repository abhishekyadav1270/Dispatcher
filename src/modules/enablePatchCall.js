import { UPDATE_PATCH_CALL_FEATURE } from './actions/type'

const initialState = {
    configPatchCall: false
}

export default (state = initialState, action) => {
    const patchCallFeatureFetch = action.data;
    switch (action.type) {
        case UPDATE_PATCH_CALL_FEATURE  :
            return {
                ...state,
                configPatchCall: patchCallFeatureFetch,
            } 
        default:
            return state
    }
}

const actions = {
    updatePatchCall: (data) => ({ type: UPDATE_PATCH_CALL_FEATURE, data }),
}

export const updatePatchCall = (data) => {
    console.log("update patchCallFeatureFetch --->" , data);
    return dispatch => {
        dispatch(actions.updatePatchCall(data));
    }
}