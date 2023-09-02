import { UPDATE_AMBIENCE_LISTENING_FEATURE } from './actions/type'
const initialState = {
    configAmbienceListening: false
}

export default (state = initialState, action) => {
    const ambienceListeningFeatureFetch = action.data; 
    switch (action.type) {
        case UPDATE_AMBIENCE_LISTENING_FEATURE  :
            return {
                ...state,
                configAmbienceListening: ambienceListeningFeatureFetch,
            } 
        default:
            return state
    }
}

const actions = {
    updateAmbienceListening: (data) => ({ type: UPDATE_AMBIENCE_LISTENING_FEATURE, data }),
}

export const updateAmbienceListening = (data) => {
    console.log("update ambienceListeningFeatureFetch --->" , data);
    return dispatch => {
        dispatch(actions.updateAmbienceListening(data));
    }
}