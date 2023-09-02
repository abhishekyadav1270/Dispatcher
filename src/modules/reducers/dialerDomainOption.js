
import {
    DIALER_OPTION,
} from '../actions/type';

const initialState = {
    dialerdomainOptions: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case DIALER_OPTION:
            if (action.domainOptions) {
                return { ...state, dialerdomainOptions: action.domainOptions }
            } else {
                return state
            }
            
        default:
            return state
    }
}