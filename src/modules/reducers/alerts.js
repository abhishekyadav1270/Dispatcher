import { GET_ALL_ALERT_LIST_TYPES,GET_ALL_ALERT_LIST } from "../actions/type";
const initialState = {
    allAlertList:[],
    allAlertListType :[]
}
export default (state = initialState, action) => {
    switch(action.type){
        case GET_ALL_ALERT_LIST_TYPES : {
            return  {...state,allAlertListType : action.data}
        }
        case GET_ALL_ALERT_LIST : {
            return {...state,allAlertList: action.data}
        }
        default:
            return state
    }
}
