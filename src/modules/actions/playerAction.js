import { 
    FETCH_CALL_RECORD,
    SET_CALL_RECORD_OBJ, 
    SET_PAGE,
    SET_TOTAL_PAGE,
    SET_HAS_MORE,
    SET_LOADER,
    SET_SHOWING_NEXT_DATA
 } from "./type"

const actions = {
    fetchCallRecordTable: (data)=> ({type: FETCH_CALL_RECORD, data}),
    setCallRecordObj: (data)=> ({type: SET_CALL_RECORD_OBJ, data}),
    setPage: (data)=> {
        console.log("setpage action --",setPage);
       return  ({type: SET_PAGE, data})
    },
    setTotalPage: (data)=> ({type: SET_TOTAL_PAGE, data}),
    setHasMore: (data)=>({type: SET_HAS_MORE, data}),
    setLoader: (data)=>({type: SET_LOADER, data}),
    setShowingNextData: (data)=>({type: SET_SHOWING_NEXT_DATA, data})
}


export const getCallRecord = (data)=>{
    return dispatch => {
        // console.log("setpage callrecord---",data);
        dispatch(actions.fetchCallRecordTable(data))
    }
}

export const setCallRecordObj = (data)=>{
    return dispatch => {
        dispatch(actions.setCallRecordObj(data))
    }
}

export const setPage = (data)=>{
    console.log("setpage--",data);
    return dispatch => {
        dispatch(actions.setPage(data))
    }
}

export const setTotalPage = data=>{
    return dispatch=>{
        dispatch(actions.setTotalPage(data))
    }
}

export const setHasMore = data=>{
    return dispatch=>{
        dispatch(actions.setHasMore(data))
    }
}

export const setLoader = data=>{
    return dispatch=>{
        dispatch(actions.setLoader(data))
    }
}

export const setShowingNextData = data=>{
    return dispatch=>{
        dispatch(actions.setShowingNextData(data))
    }
}