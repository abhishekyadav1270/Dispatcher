import {
    FETCH_USERLIST_ADMIN,
    UPDATE_USERLIST_ADMIN,
    FETCH_FALIST_ADMIN,
    UPDATE_FALIST_ADMIN,
    CREATE_USER_ADMIN,
    DELETE_USER_ADMIN,
    UPDATE_USER_ADMIN,
    UPDATE_FA_ADMIN,
    ADD_FA_ADMIN,
    FA_DETAIL_ADMIN,
    UPDATE_FADETAIL_ADMIN,
    RESET_FADETAIL_ADMIN,
    DELETE_FA_ADMIN,
    FETCH_PROFILE_FA_ADMIN,
    UPDATE_PROFILE_FA_ADMIN,
    FETCH_MCPTTID_URI,
    UPDATE_MCPTTID_URI,
    UPDATE_USERPROFILE_ATTACHED_FA_ADMIN,
    RESET_PROFILE_FA_ADMIN,
    CREATE_GROUP_ADMIN,
    FETCH_GROUP_ADMIN,
    UPDATE_GROUP_ADMIN,
    CREATE_ORG_ADMIN,
    FETCH_ORG_ADMIN,
    UPDATE_ORG_ADMIN,
    DELETE_ORG_ADMIN,
    UPDATE_EXISTING_ORG_ADMIN,
    DELETE_GROUP_ADMIN,
    UPDATE_EXISTING_GROUP_ADMIN,
    AFFILIATE_GROUP_TO_USER,
    USER_DEFAULT_GROUP,
    FETCH_IWF_MAP_ADMIN,
    CREATE_IWF_MAP_ADMIN,
    UPDATE_IWF_MAP_ADMIN,
    DELETE_IWF_MAP_ADMIN,
    UPDATE_EXISTING_IWF_MAP_ADMIN,
    FETCH_IWF_TYPE_ADMIN,
    UPDATE_IWF_TYPE_ADMIN,
    FETCH_GROUP_TYPE_ADMIN,
    UPDATE_GROUP_TYPE_ADMIN,
    FETCH_GROUP_DETAIL_ADMIN,
    UPDATE_GROUP_DETAIL_ADMIN,
    FETCH_ORG_GROUP_ADMIN,
    UPDATE_ORG_GROUP_ADMIN,
    RESET_ORG_GROUP_ADMIN,
    DELETE_USER,
    FETCH_IWFBYFA_ADMIN,
    UPDATE_IWFBYFA_ADMIN
    ,RESET_IWFBYFA_ADMIN,
    FETCH_IWFBYMCPTTID_ADMIN,
    UPDATE_IWFBYMCPTTID_ADMIN,
    RESET_IWFBYMCPTTID_ADMIN,
    GET_ALL_ALERT_LIST,
    GET_ALL_ALERT_LIST_TYPES,
    EDIT_ALERT_LIST_TYPES,
    UPDATE_ALL_ALERT_LIST,
    UPDATE_ALL_ALERT_LIST_TYPES,
    EDIT_ALERT_LIST,
    DELETE_ALERT_LIST,
    ADD_ALERT_LIST
} from './actions/type';


const initialState = {
    userlist: [],
    falist: [],
    faProfileDetail: {},
    grouplist: [],
    orglist: [],
    iwfMaplist: [],
    userProfileWithAttachedFA: {},
    iwfMapType: [],
    groupDetail:{},
    orgGroupList : [],
    faIWFMap : {},
    mcpttidIWFMap : {},
    allAlertList:[],
    allAlertListType :[],
    mcpttidAndUri:[]
}

export default (state = initialState, action) => {
    const userFetch = action.data;
    switch (action.type) {
        case UPDATE_GROUP_DETAIL_ADMIN :
            return {
                ...state,
                groupDetail: userFetch,
            } 
        case UPDATE_ORG_GROUP_ADMIN :
            return {
                ...state,
                orgGroupList: userFetch,
            }
        case UPDATE_USERLIST_ADMIN:
            return {
                ...state,
                userlist: userFetch,
            }
        case UPDATE_GROUP_ADMIN:
            return {
                ...state,
                grouplist: userFetch,
            }
        case UPDATE_ORG_ADMIN:
            return {
                ...state,
                orglist: userFetch,
            }
        case UPDATE_IWF_MAP_ADMIN:
            console.log("------------------------userFetch--------------------------------")
            console.log(userFetch)
            return {
                ...state,
                iwfMaplist: userFetch,
            }
        case UPDATE_FALIST_ADMIN:
            return {
                ...state,
                falist: userFetch.filter(element => element.CallerDescr.length > 0)
            }
        case UPDATE_FADETAIL_ADMIN:
            return {
                ...state,
                faProfileDetail: userFetch
            }
        case RESET_FADETAIL_ADMIN:
            return {
                ...state,
                faProfileDetail: {}
            }
        case UPDATE_PROFILE_FA_ADMIN:
            return {
                ...state,
                userProfileWithAttachedFA: userFetch
            }
        case UPDATE_MCPTTID_URI:
            return {
                ...state,
                mcpttidAndUri: userFetch
            }
        case RESET_PROFILE_FA_ADMIN:
            return {
                ...state,
                userProfileWithAttachedFA: {}
            }
        case UPDATE_IWF_TYPE_ADMIN:
            return {
                ...state,
                iwfMapType: userFetch
            } 
        case UPDATE_GROUP_TYPE_ADMIN:
            return {
                ...state,
                groupTypes: userFetch
            }    
        case UPDATE_IWFBYFA_ADMIN:
            return {
                ...state,
                faIWFMap: userFetch
            }
       case RESET_IWFBYFA_ADMIN:
            return {
                ...state,
                faIWFMap: {}
            }  
        case UPDATE_IWFBYMCPTTID_ADMIN:
            return {
                ...state,
                mcpttidIWFMap: userFetch
            }
        case RESET_IWFBYMCPTTID_ADMIN:
            return {
                ...state,
                mcpttidIWFMap: {}
            }   
        case UPDATE_ALL_ALERT_LIST:
            return {
                ...state,
                allAlertList: userFetch
            }
        case UPDATE_ALL_ALERT_LIST_TYPES:
            return {
                ...state,
                allAlertListType: userFetch
            }                     
        default:
            return state
    }
};

const actions = {
    fetchUserListAdmin: () => ({ type: FETCH_USERLIST_ADMIN }),
    fetchGroupListAdmin: () => ({ type: FETCH_GROUP_ADMIN }),
    fetchOrgListAdmin: () => ({ type: FETCH_ORG_ADMIN }),
    fetchIwfMapListAdmin: () => ({type : FETCH_IWF_MAP_ADMIN}),
    fetchIwfTypeAdmin: () => ({type : FETCH_IWF_TYPE_ADMIN}),

    fetchFAListAdmin: () => ({ type: FETCH_FALIST_ADMIN }),
    createUserAdmin: (data) => ({ type: CREATE_USER_ADMIN, data }),
    
    createOrgAdmin: (data) => ({ type: CREATE_ORG_ADMIN, data }),
    createGroupAdmin: (data) => ({ type: CREATE_GROUP_ADMIN, data }),
    affiliateGroupToUser: (data) => ({ type: AFFILIATE_GROUP_TO_USER, data }),
    userDefaultGroup: (data) => ({ type: USER_DEFAULT_GROUP, data }),
    createIwfMapAdmin: (data) => ({ type: CREATE_IWF_MAP_ADMIN, data }),

    updateUserAdmin: (data) => ({ type: UPDATE_USER_ADMIN, data }),
    deleteUserAdmin: (data) => ({ type: DELETE_USER_ADMIN, data }),
    deleteOrgAdmin: (data) => ({ type: DELETE_ORG_ADMIN, data }),
    updateOrgAdmin: (data) => ({ type: UPDATE_EXISTING_ORG_ADMIN, data }),
    updateIwfMapAdmin: (data) => ({ type: UPDATE_EXISTING_IWF_MAP_ADMIN, data }),

    fetchGroupTypeAdmin: () => ({type : FETCH_GROUP_TYPE_ADMIN}),
    getMembersForOrgGroup: (data) => ({type : FETCH_ORG_GROUP_ADMIN,data}),
    resetOrgGroupAdmin: () => ({type : RESET_ORG_GROUP_ADMIN}),
    getGroupDetail: (data) => ({type : FETCH_GROUP_DETAIL_ADMIN,data}),
    deleteGroupAdmin: (data) => ({ type: DELETE_GROUP_ADMIN, data }),
    updateGroupAdmin: (data) => ({ type: UPDATE_EXISTING_GROUP_ADMIN, data }),
    deleteIwfMapAdmin: (data) => ({ type: DELETE_IWF_MAP_ADMIN, data }),


    updateFAAdmin: (data) => ({ type: UPDATE_FA_ADMIN, data }),
    addFAAdmin: (data) => ({ type: ADD_FA_ADMIN, data }),
    fetchFAAdminDetail: (data) => ({ type: FA_DETAIL_ADMIN, data }),
    resetFADetails: () => ({ type: RESET_FADETAIL_ADMIN }),
    deleteFAAdmin: (data) => ({ type: DELETE_FA_ADMIN, data }),
    fetchUserProfileWithAttachedFAS: (data) => ({ type: FETCH_PROFILE_FA_ADMIN, data }),
    updateUserProfileWithAttachedFAS: (data) => ({ type: UPDATE_USERPROFILE_ATTACHED_FA_ADMIN, data }),
    resetUserProfileWithAttachedFAS: (data) => ({ type: RESET_PROFILE_FA_ADMIN, data }),

    fetchMcpttIdAndUri: () => ({ type: FETCH_MCPTTID_URI }),

    getIWFMapByFa: (data) => ({type : FETCH_IWFBYFA_ADMIN , data}),
    updateIWFMapByFa: (data) => ({type : UPDATE_IWFBYFA_ADMIN,data}),
    resetIWFMapByFa: () => ({type : RESET_IWFBYFA_ADMIN}),
    
    getIWFMapByMCPTTID: (data) => ({type : FETCH_IWFBYMCPTTID_ADMIN , data}),
    updateIWFMapByMCPTTID: (data) => ({type : UPDATE_IWFBYMCPTTID_ADMIN,data}),
    resetIWFMapByMCPTTID: () => ({type : RESET_IWFBYMCPTTID_ADMIN}),

    getAllAlerts : ()=>({type :GET_ALL_ALERT_LIST}),
    getAlertTypes : ()=>({type :GET_ALL_ALERT_LIST_TYPES}),
    editAlert : (data)=>({type :EDIT_ALERT_LIST,data}),
    deleteAlert : (data)=>({type :DELETE_ALERT_LIST,data}),
    addAlert : (data)=>({type :ADD_ALERT_LIST,data}),
    
}

/**
 *  Action: 'fetchUserList'
 */

export const fetchUserListAdmin = () => {
    return dispatch => {
        dispatch(actions.fetchUserListAdmin())
    }
}
export const fetchGroupListAdmin = () => {
    return dispatch => {
        dispatch(actions.fetchGroupListAdmin())
    }
}
export const fetchGroupTypeAdmin = () => {
    console.log("fetchGroupTypeAdmin")
    console.log("fetchGroupTypeAdmin")
    console.log("fetchGroupTypeAdmin")
    return dispatch => {
        dispatch(actions.fetchGroupTypeAdmin())
    }
}
export const getGroupDetail = (data) => {
    console.log("getGroupDetail ")
    console.log("getGroupDetail ")
    console.log("getGroupDetail ",data)
    return dispatch => {
        dispatch(actions.getGroupDetail(data))
    }
}

export const getMembersForOrgGroup = (data) => {
    console.log("getMembersForOrgGroup ")
    console.log("getMembersForOrgGroup ")
    console.log("getMembersForOrgGroup ",data)
    return dispatch => {
        dispatch(actions.getMembersForOrgGroup(data))
    }
}

export const resetOrgGroupAdmin = () => {

    return dispatch => {
        dispatch(actions.resetOrgGroupAdmin())
    }
}
export const fetchOrgListAdmin = () => {
    return dispatch => {
        dispatch(actions.fetchOrgListAdmin())
    }
}
export const fetchIwfMapListAdmin = () => {
    return dispatch => {
        dispatch(actions.fetchIwfMapListAdmin())
    }
}
export const fetchIwfTypeAdmin = () => {
    return dispatch => {
        dispatch(actions.fetchIwfTypeAdmin())
    }
}

export const fetchFAListAdmin = () => {
    return dispatch => {
        dispatch(actions.fetchFAListAdmin())
    }
}

export const createUserAdmin = (data) => {
    return dispatch => {
        dispatch(actions.createUserAdmin(data))
    }
}

export const createOrgAdmin = (data) => {
    return dispatch => {
        dispatch(actions.createOrgAdmin(data))
    }
}
export const createGroupAdmin = (data) => {
    return dispatch => {
        dispatch(actions.createGroupAdmin(data))
    }
}

export const createIwfMapAdmin = (data) => {
    return dispatch => {
        dispatch(actions.createIwfMapAdmin(data))
    }
}

export const affiliateGroupToUser = (data) => {
    return dispatch => {
        dispatch(actions.affiliateGroupToUser(data))
    }
}
export const userDefaultGroup = (data) => {
    return dispatch => {
        dispatch(actions.userDefaultGroup(data))
    }
}
export const deleteUserAdmin = (data) => {
    return dispatch => {
        dispatch(actions.deleteUserAdmin(data))
    }
}
export const deleteOrgAdmin = (data) => {
    return dispatch => {
        dispatch(actions.deleteOrgAdmin(data))
    }
}

export const deleteIwfMapAdmin = (data) => {
    return dispatch => {
        dispatch(actions.deleteIwfMapAdmin(data))
    }
}

export const updateOrgAdmin = (data) => {
    return dispatch => {
        dispatch(actions.updateOrgAdmin(data))
    }
}
export const deleteGroupAdmin = (data) => {
    return dispatch => {
        dispatch(actions.deleteGroupAdmin(data))
    }
}
export const updateGroupAdmin = (data) => {
    return dispatch => {
        dispatch(actions.updateGroupAdmin(data))
    }
}


export const deleteFAAdmin = (data) => {
    return dispatch => {
        dispatch(actions.deleteFAAdmin(data))
    }
}

export const updateUserAdmin = (data) => {
    return dispatch => {
        dispatch(actions.updateUserAdmin(data))
    }
}

export const updateFAAdmin = (data) => {
    return dispatch => {
        dispatch(actions.updateFAAdmin(data))
    }
}
export const updateIwfMapAdmin = (data) => {
    console.log("---------------updateIwfMapAdmin---------------")
    console.log(data)
    return dispatch => {
        dispatch(actions.updateIwfMapAdmin(data))
    }
}

export const addFAAdmin = (data) => {
    return dispatch => {
        dispatch(actions.addFAAdmin(data))
    }
}

export const fetchFAAdminDetail = (data) => {
    return dispatch => {
        dispatch(actions.fetchFAAdminDetail(data))
    }
}

export const resetFADetails = () => {
    return dispatch => {
        dispatch(actions.resetFADetails())
    }
}

export const fetchUserProfileWithAttachedFAS = (data) => {
    return dispatch => {
        dispatch(actions.fetchUserProfileWithAttachedFAS(data))
    }
}

export const updateUserProfileWithAttachedFAS = (data) => {
    return dispatch => {
        dispatch(actions.updateUserProfileWithAttachedFAS(data))
    }
}

export const resetUserProfileWithAttachedFAS = () => {
    return dispatch => {
        dispatch(actions.resetUserProfileWithAttachedFAS())
    }
}

export const fetchMcpttIdAndUri = () => {
    console.log("Inside fetchMcpttIdAndUri ")
    return dispatch => {
        dispatch(actions.fetchMcpttIdAndUri())
    }
}


export const getIWFMapByFa = (data) => {
    return dispatch => {
        dispatch(actions.getIWFMapByFa(data))
    }
}

export const getIWFMapByMCPTTID = (data) => {
    return dispatch => {
        dispatch(actions.getIWFMapByMCPTTID(data))
    }
}
export const resetIWFMapByFa = (data) => {
    return dispatch => {
        dispatch(actions.resetIWFMapByFa(data))
    }
}

export const resetIWFMapByMCPTTID = (data) => {
    return dispatch => {
        dispatch(actions.resetIWFMapByMCPTTID(data))
    }
}


export const getAllAlerts =() =>{
    return dispatch => {
        dispatch(actions.getAllAlerts())
    }
}

export const getAlertTypes =()=>{
    return dispatch => {
        dispatch(actions.getAlertTypes())
    }
}

export const editAlert =(data)=>{
    return dispatch => {
        dispatch(actions.editAlert(data))
    }
}

export const deleteAlert =(code)=>{
    return dispatch => {
        dispatch(actions.deleteAlert(code))
    }
}

export const addAlert =(data)=>{
    return dispatch => {
        dispatch(actions.addAlert(data))
    }
}

