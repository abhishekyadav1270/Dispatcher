import { UPDATE_MERGE_CALL_FEATURE } from './actions/type'

const initialState = {
    configMergeCall: false
}

export default (state = initialState, action) => {
    const mergeCallFeatureFetch = action.data;
    switch (action.type) {
        case UPDATE_MERGE_CALL_FEATURE  :
            return {
                ...state,
                configMergeCall: mergeCallFeatureFetch,
            } 
        default:
            return state
    }
}

const actions = {
    updateMergeCall: (data) => ({ type: UPDATE_MERGE_CALL_FEATURE, data }),
}

export const updateMergeCall = (data) => {
    console.log("update mergeCallFeatureFetch --->" , data);
    return dispatch => {
        dispatch(actions.updateMergeCall(data));
    }
}