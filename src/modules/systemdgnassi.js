import { UPDATE_SYSTEM_DGNA_SSI } from './actions/type'
const initialState = {
    systemDgnaSSI: []
}

export default (state = initialState, action) => {
    const systemdgnas = action.data;
    switch (action.type) {
        case UPDATE_SYSTEM_DGNA_SSI :
            return {
                ...state,
                systemDgnaSSI: systemdgnas,
            } 
        default:
            return state
    }
}

const actions = {
    updateSystemDgnaSSI: (data) => ({ type: UPDATE_SYSTEM_DGNA_SSI, data }),
}

export const updateSystemDgnaSSI = (data) => {
    return dispatch => {
        dispatch(actions.updateSystemDgnaSSI(data))
    }
}