export const AddGroupData=(groupData)=>{
    let addGroupData={}
    return{
        ...addGroupData,
        basicinfoData: groupData.basicinfoData? groupData.basicinfoData:{}

    }

}

export const DefaultGroupBasicInfoData = {
    groupName:"",
    priority :""
}