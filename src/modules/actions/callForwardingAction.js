import axios from 'axios';
import { endpoints } from '../../constants/endpoints';
import { SET_CALL_FORWARD} from './type'

const actions = {
    // fetchCallFordward : (data)=>({type :FETCH_CALL_FORWARD,data}),
    setCallForward : (data)=>({type :SET_CALL_FORWARD,data})
}

// export const fetchCallFordward = (data)=>{
//     return dispatch => {
//         // console.log("setpage callrecord---",data);
//         dispatch(actions.fetchCallFordward(data))
//     }
// }

export const setCallForward = (data)=>{
    return dispatch => {
        dispatch(actions.setCallForward(data))
    }
}
