/**
 *  Reducer: 'SETTINGS'
 */
import { 
    UPDATE_MPTT_KEY,
} from "./actions/type"


 const initialState = {
   mpttKey: 'F13'
 }
 
 export default (state = initialState, action) => {
   switch (action.type) {
 
     case UPDATE_MPTT_KEY:
       return {
         ...state,
         mpttKey: action.data
       }
 
     default:
       return state
   }
 }
 
 const actions = {
   updateMasterPttKey: (data) => ({type: UPDATE_MPTT_KEY,data}),
 }
 
 /**
  *  Action: 'showMessage'
  */
 export const updateMasterPttKey = (data) => {
   return dispatch => {
     dispatch(actions.updateMasterPttKey(data))
   }
 }