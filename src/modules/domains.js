import { UPDATE_DOMAINS } from './actions/type'
const initialState = {
    configDomain: {}
}

export default (state = initialState, action) => {
    const domainFetch = action.data;
    switch (action.type) {
        case UPDATE_DOMAINS :
            return {
                ...state,
                configDomain: domainFetch,
            } 
        default:
            return state
    }
}

const actions = {
    updateDomain: (data) => ({ type: UPDATE_DOMAINS, data }),
}

export const updateDomain = (data) => {
    return dispatch => {
        dispatch(actions.updateDomain(data))
    }
}