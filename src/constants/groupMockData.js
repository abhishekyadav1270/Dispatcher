export let groupMockData= [
  {
    basicinfo: {
      groupname: "Group A",
      priority: "abc",
      id:"12676aggsh"
    },
    members: [
      {
        id: "1",
        name: "Ashish"
      },
      {
        id: "2",
        name: "Anand"
      }
    ],
    mcpttConfig: {
      groupType: "arranged",
      hangTimer: {
        hour: "2",
        min: "15",
        sec: "0"
      }
    }
  },
  {
    basicinfo: {
      groupname: "Group B",
      priority: "abc",
      id:"78654hdyidh"

    },
    members: [
      {
        id: "1",
        name: "Ashish"
      },
      {
        id: "2",
        name: "Anand"
      },
      {
        id: "3",
        name: "Abhs"
      }
    ],
    mcpttConfig: {
      groupType: "arranged",
      hangTimer: {
        hour: "2",
        min: "15",
        sec: "0"
      }
    }
  },
  {
    basicinfo: {
      groupname: "Group C",
      priority: "abc",
      id:"956328aopije"

    },
    members: [
      {
        id: "1",
        name: "Ashish"
      },
      {
        id: "2",
        name: "Anand"
      }
    ],
    mcpttConfig: {
      groupType: "arranged",
      hangTimer: {
        hour: "2",
        min: "15",
        sec: "0"
      }
    }
  }
  ];

  export let orgMockData = [
    {
      oname: "Org A",
      oid: "123skksnkjnskk654",
      description: "multi_client_user_a",
    },
    {
      oname: "Org B",
      oid: "564ashjhubnj84879",
      description: "multi_client_user_a",
    },
    {
      oname: "Org C",
      oid: "1236skjnksjnkkks545",
      description: "multi_client_user_a",
    },
    {
      oname: "Org D",
      oid: "6549sjbjhjhjhdjjd878",
      description: "multi_client_user_a",
    }
  ];

  //For Org
  export const NewOrgMock=(newData)=>{
    orgMockData=[...orgMockData,newData]
    return orgMockData
    
  }
  export const UpdateOrgMock=(newData)=>{
    orgMockData=   orgMockData.map(item=>{
      if (item.oid===newData.oid) {
        return newData
      }
      return item})
    return orgMockData
    
  }
  export const DeleteOrgMock=(data)=>{
    orgMockData = orgMockData.filter((item) => item.oid !== data.oid);
    return orgMockData

  }

  //For Group
  export const NewGroupMock=(newData)=>{
    groupMockData=[...groupMockData,newData]
    return groupMockData
    
  }
  export const UpdateGroupMock=(newData)=>{
    groupMockData=   groupMockData.map(item=>{
      if (item.basicinfo.id===newData.basicinfo.id) {
        return newData
      }
      return item})
    return groupMockData
    
  }
  export const DeleteGroupMock=(data)=>{
    groupMockData = groupMockData.filter((item) => item.basicinfo.groupname !== data.basicinfo.groupname);
    return groupMockData

  }