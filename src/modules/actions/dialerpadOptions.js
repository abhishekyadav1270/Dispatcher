import {
    DIALER_OPTION,
} from './type';

const actions = {
    fetchDialerPadOptions: (domainOptions) => ({ type: DIALER_OPTION, domainOptions }),
}

export const fetchDialerPadOptions = (domainOptions) => (dispatch) => {
    dispatch(actions.fetchDialerPadOptions(domainOptions));
}
