import React, { useState, useEffect } from "react";
const DefaultInfoData = {
  orgName: "",
  orgId: "",
  orgProfile: ""
}

const CreateOrg = (props) => {
  const { infoHandler, infoData } = props
  const [orgInfo, SetorgInfo] = useState(DefaultInfoData)
  const [emptyOrgId, setEmptyOrg] = useState(false)
  const [emptyOrgName, setEmptyOrgName] = useState(false)
  const [emptyOrgProfile, setEmptyOrgProfile] = useState(false)




  useEffect(() => {
    if (infoData && infoData.oid !== "") {
      SetorgInfo(infoData)

    }
    else{
      SetorgInfo(DefaultInfoData)

    }

  }, [])


  const UpdateBasicDetails = () => {
    console.log("update org ", orgInfo);
   // infoHandler(orgInfo)
    if ((orgInfo.orgId.length===0 ))
     {
          setEmptyOrg(true)
        
    }
     else if(orgInfo.orgName.length===0)
    {
      setEmptyOrgName(true)
    }
    else if(orgInfo.orgProfile.length===0 )
    {
    setEmptyOrgProfile(true)
    } 
    else{
     
      infoHandler(orgInfo)
    }

  }
  const nameChangeHandler = (e) => {
    SetorgInfo({
      ...orgInfo,
      orgName: e.target.value,
    });
    if (e.target.value.length!==0) {
      setEmptyOrgName(false)
    } else {
      setEmptyOrgName(true)
    }
    console.log("update org name", orgInfo);

  };
  const idChangeHandler = (e) => {
    SetorgInfo({
      ...orgInfo,
      orgId: e.target.value,
    });
    if (e.target.value.length!==0) {
      setEmptyOrg(false)
    } else {
      setEmptyOrg(true)
    }
  };
  const descriptioChangeHandler = (e) => {
    SetorgInfo({
      ...orgInfo,
      orgProfile: e.target.value,
    });
    if (e.target.value.length!==0) {
      setEmptyOrgProfile(false)
    } else {
      setEmptyOrgProfile(true)
    }
  };
  return (
    <div>
      <div class="tab1-account">
        <div class="form-group">
          <label class="attribute-heading" >Org Id</label>
          <input type="text" class="form-control" value={orgInfo.orgId} id="name" onChange={idChangeHandler} disabled={infoData}/>
          {
                emptyOrgId === true ?
                  (
                    <label class="error-handling-lbl">Please enter the OrgId</label>
                  )
                  :
                  null
              }
        </div>
        <div class="form-group">
          <label for="priority">Name</label>
          <input type="text"
           class="form-control"
           value={orgInfo.orgName} 
           id="priority"
            onChange={nameChangeHandler} />
          {
                emptyOrgName === true ?
                  (
                    <label class="error-handling-lbl">Please enter the name</label>
                  )
                  :
                  null
              }
        
        </div>
        <div class="form-group">

          <label for="priority">Description</label>
          <input type="text" class="form-control" id="priority" value={orgInfo.orgProfile} onChange={descriptioChangeHandler} />
          {
                emptyOrgProfile === true ?
                  (
                    <label class="error-handling-lbl">Please enter the profile</label>
                  )
                  :
                  null
              }
        </div>
      </div>
      <button
        class="update-btn-profile"
        type="button"
        onClick={UpdateBasicDetails}
      >
        SUBMIT
        {/* {newOrUpdateProfile ? 'SUBMIT' : 'UPDATE'} */}
      </button>
    </div>
  )

}
export default CreateOrg
