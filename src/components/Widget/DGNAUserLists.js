import React, { Component,useState,useEffect } from 'react'
import { connect } from 'react-redux'
import { delUserLists, editUserLists, fetchUserLists } from '../../modules/common'
import DgnaEditMembers from './DgnaEditMembers'

//Other
var demogroup =[
    { id:1, name: 'Up Trains', grpMembers:[]},
    { id:2, name: 'Down Trains', grpMembers:[]},
    { id:3, name: 'All Trains', grpMembers:[]},
  ]

const DGNAUserLists = (props) => {
    const [showDetail, setShow] = useState(false);
    const [selDgna, setSel] = useState({});
    const [editList, setEdit] = useState(false);
    const [selMembers, setMembers] = useState([]);
    const [groupName, setGroupName] = useState('');
    
    const { close,userLists,fetchUserLists,delUserLists,editUserLists } = props;
    useEffect(() => {
        fetchUserLists()
    }, [])
    //functions
    const showDetails = (data,edit=false) => {
        setShow(true);
        setSel(data)
        setMembers(data.grpMembers)
        setGroupName(data.name)
        if(edit !== editList) setEdit(edit)
    };

    const closeDetails =()=>{
        setShow(false);
        setEdit(false);
        setSel({})
        setMembers([])
    }

    const setName = (grpName) =>{
        if(grpName.length<=12) setGroupName(grpName);
    }

    const saveChanges = () =>{
        if(selMembers.length>0){
            setEdit(!editList)
            const listData ={
                ...selDgna,
                name: groupName,
                grpMembers: selMembers
            }
            console.log('EDITED LIST',selMembers,selDgna)
            editUserLists(listData)
        }
    }

    return (
        <div class="" id="call2" v-if="seen2">
            <div class="main-widg-grid">
                <div class="widg-header">
                    <div class="title-grid-2">
                        <div class="title al-center">
                            <p class="f-title-m white in-blc">User Lists</p>
                        </div>
                        <div class="search al-center">
                            <button class={"sq-icon-btn in-blc wx32 m-r-5"} 
                                onClick={close}>
                                <i class={'feather icon-x'}></i>
                            </button>
                        </div>
                    </div>
                    <p class="f-text-10 all-caps ml-1" style={{ color: '#8A98AC' }}>Exported User Lists</p>
                </div>
                <div class="widg-body m-t-12">
                    {!showDetail?
                    <div class="dgna-sq-card-grid ovr-scr-y" style={{height:'290px'}}>
                        {userLists && userLists.map((data,id)=>{
                            return(
                            <div class="userlist-card" key={id}>
                                <div class="">
                                    <img class="mr-8" src="assets/images/ic_baseline-group.svg" alt="dgna-group" />
                                </div>
                                <div class=""><p class="lim-30 white">{data.name+' ( '+data.grpMembers.length+' )'}</p></div>
                                <div class="">
                                    <button class={"sq-icon-btn in-blc wx32 m-r-5"} 
                                        onClick={()=>showDetails(data)}>
                                        <i class={'feather icon-info'}></i>
                                    </button>
                                </div>
                                <div class="">
                                    <button class={"sq-icon-btn in-blc wx32 m-r-5"} 
                                        onClick={()=>showDetails(data,true)}>
                                        <i class={'feather icon-edit'}></i>
                                    </button>
                                </div>
                                <div class="">
                                    <button class={"sq-icon-btn in-blc wx32 m-r-5"} 
                                        onClick={()=>delUserLists(data)}>
                                        <i class={'feather icon-trash'}></i>
                                    </button>
                                </div>
                            </div>
                            )
                        })}
                        {userLists && userLists.length ===0?
                            <div
                                class="pt-6 pb-6 pr-6 pl-6 f-18 f-reg white" 
                                style={{height:'290px',display: 'flex', justifyContent:'center', alignItems:'center',whiteSpace:'pre-wrap'}}
                            >{'No exported userlist found!'}
                            </div>
                        :null}
                    </div>
                    :
                    <div>
                        <button class={"sq-icon-btn in-blc wx32 m-r-5"} 
                            onClick={closeDetails}>
                            <i class={'feather icon-arrow-left'}></i>
                        </button>
                        {/* <p class="f-title-m white in-blc">{selDgna.name}</p> */}
                        <input 
                            class="textinput" 
                            type="text" 
                            placeholder="Group Name" 
                            style={{padding:'8px 8px'}}
                            onChange={(e)=> setName(e.target.value)}
                            value={groupName}
                            disabled={!editList}
                        />
                        <button class={"sq-icon-btn in-blc wx32 flt-r"} 
                            onClick={()=>editList?saveChanges():setEdit(!editList)}>
                            <i class={'feather '+(editList?'icon-save':'icon-edit')}></i>
                        </button>
                        <DgnaEditMembers 
                            members={selMembers}
                            Class='wrap-2 border-2 m-t-5' 
                            height={editList?'190px':'200px'}
                            edit={editList}
                            updateMembers={(mem)=> setMembers(mem)}
                        />
                    </div>
                    }
                </div>
                <div class="widg-footer"></div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ common }) => {
    const { userLists } = common;
    return {
        userLists
    };
  };
  
export default connect(mapStateToProps, { fetchUserLists,delUserLists,editUserLists })(DGNAUserLists);
