import { 
    UPDATE_CALL_RECORD,
    SET_PAGE,
    SET_TOTAL_PAGE,
    SET_HAS_MORE,
    SET_LOADER,
    SET_SHOWING_NEXT_DATA,
} from "../actions/type";
let initialState = {
    callRecord: [],
    pagination: {},
    callRecordReqObj: {},
    currentPage: 1,
    totalPage: 1,
    hasMore: true,
    loading: false,
    showingNextData: false
}
export default (state=initialState,action) => {
    switch(action.type){
        case UPDATE_CALL_RECORD:
            let callData = action.data;
            return {
                ...state, 
                callRecord: callData.pagination.currentPage == 1 ? callData.data : [...state.callRecord, ...callData.data ],
                pagination: callData.pagination,
                callRecordReqObj: callData.params
            }
        case SET_PAGE:
            console.log("---setpage reducer--",action);
            return {...state, currentPage: action.data}
        case SET_TOTAL_PAGE:
            return {...state, totalPage: action.data}
        case SET_HAS_MORE:
            return {...state, hasMore: action.data}
        case SET_LOADER:
            return {...state, loading: action.data}
        case SET_SHOWING_NEXT_DATA:
            return {...state, showingNextData: action.data}
        default :
        return state;
    }
}