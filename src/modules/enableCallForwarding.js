import { UPDATE_CALL_FORWARDING_FEATURE } from './actions/type'

const initialState = {
    configCallForwarding: false
}

export default (state = initialState, action) => {
    const callForwardingFetch = action.data;
    switch (action.type) {
        case UPDATE_CALL_FORWARDING_FEATURE  :
            return {
                ...state,
                configCallForwarding: callForwardingFetch,
            } 
        default:
            return state
    }
}

const actions = {
    updateCallForward: (data) => ({ type: UPDATE_CALL_FORWARDING_FEATURE, data }),
}

export const updateCallForward = (data) => {
    console.log("update CallForwardingFeatureFetch --->" , data);
    return dispatch => {
        dispatch(actions.updateCallForward(data));
    }
}