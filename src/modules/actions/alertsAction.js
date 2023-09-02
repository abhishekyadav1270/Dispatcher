import axios from 'axios';
import { EndPoints } from '../../MCXclient/endpoints';
import { GET_ALL_ALERT_LIST,GET_ALL_ALERT_LIST_TYPES} from './type'

const action = {
    getAllAlerts : (data)=>({type :GET_ALL_ALERT_LIST,data}),
    getAllAlertsListType : (data)=>({type :GET_ALL_ALERT_LIST_TYPES,data})
}

export const getAllAlerts =() => (dispatch) =>{
    console.log("in getAllAlerts",dispatch)
    return axios.post(EndPoints.getConfig().getAlertAllList).then(res=>{
        console.log("getAllAlerts",res.data)
        dispatch(action.getAllAlerts(res.data))
        return res
    }).catch(e=>{
        console.log('🥴 FAILED')
        return null
    })
}

export const getAlertTypes =()=>{
    return dispatch => {
        console.log("in getAlertTypes",dispatch)
        return axios.get(EndPoints.getConfig().getAlertTypes).then(res=>{
            console.log("in getAlertTypes res",res)
            if(!res.data.error)
            dispatch(action.getAllAlertsListType(res.data.response))
            return res
        }).catch(e=>{
            console.log('🥴 FAILED')
            return null
        })
    }
}

export const editAlert =(data)=>{
    return dispatch => {
        return axios.put(EndPoints.getConfig().updateAlert,{data:data}).then(res=>{
            if(!res.data.error)
            dispatch(getAllAlerts())
            return res
        }).catch(e=>{
            console.log('🥴 FAILED')
            return null
        })
    }
}

export const deleteAlert =(code)=>{
    return dispatch => {
        return axios.delete(EndPoints.getConfig().deleteAlertByCode,{data:code}).then(res=>{
            console.log("deleteAlert",res,!res.data.error)
            if(!res.data.error)
            {
                console.log("before alert")
                dispatch(getAllAlerts())
            }
            return res
        }).catch(e=>{
            console.log('🥴 FAILED')
            return null
        })
    }
}

export const addAlert =(data)=>{
    return dispatch => {
        return axios.post(EndPoints.getConfig().addAlert,{data:data}).then(res=>{
            if(!res.data.error)
            {
                dispatch(getAllAlerts())
            }
            //getAllAlerts()
            return res
        }).catch(e=>{
            console.log('🥴 FAILED')
            return null
        })
    }
}