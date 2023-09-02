import { FETCH_REG_USERS_LIST } from "./actions/type";
const initialState = {
    regUsersList:[]
};

export default (state=initialState,action)=>{
    const incomingData = action.data;
    //console.log("action data----", );
    switch(action.type){
        case FETCH_REG_USERS_LIST :
            console.log("registered list is working",incomingData);
            return { ...state, regUsersList:incomingData}
        default:
            return state
    }
}

const actions = {
    fetchRegisteredUsersList: (data)=>({ type: FETCH_REG_USERS_LIST, data })
}

export const fetchRegisteredUsersList = (data) => {
    return dispatch => {
        dispatch(actions.fetchRegisteredUsersList(data))
    }
}