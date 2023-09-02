import React , { useState, useEffect, useRef } from 'react'
import {Grid ,TextField,makeStyles, Checkbox as MuiCheckBox,FormControl,FormControlLabel,Typography} from "@material-ui/core";
import { margin } from '@mui/system';
import Button from '@mui/material/Button';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const animatedComponents = makeAnimated();
//import { makeStyles, ThemeProvider } from "@material-ui/styles";
 

const useStyles = makeStyles((theme) => ({
   root:{
       '& .MuiFormControl-root': {
           width:'100%',
           margin : theme.spacing(0.5),
       }
       ,
       '& .MuiTypography-root' : {
           lineHeight: '2.6'
       },
       '& .MuiGrid-container':{
           justifyContent: "center",
           alignItems: "center"
       }
 
   }
 
}))
 
const UserFilterBody = (props) => {
 
   const classes =useStyles();
   const { userFilter,setUserFilter, userFilterHandler, setIsUserFilterModalOpen ,iconOptions } = props;
//    const userFilterObj={
//        activeUser:{
//            isActiveUser:false,
//            lastUpdatedSec:"0"
//        },
//        userInsideGeoFence:false
//    }
 
//    const [userFilter,setUserFilter]=useState(userFilterObj);
  
   //const [lastUpdatedSec, setLastUpdatedSec] = useState("0");
  
 
   const handleActiveUserChange = (e) => {
      console.log("UserFilterBody",e.target.value)
      setUserFilter({...userFilter,activeUser:{...userFilter.activeUser ,isActiveUser:e.target.checked} })
   };
 
   const handleUserInsideGeoChange =(e) =>{
       setUserFilter({...userFilter,userInsideGeoFence:e.target.checked })
   }
 
  
   const secChangeHandler = (e) => {
       //setLastUpdatedSec(e.target.value)
       setUserFilter({...userFilter,activeUser:{...userFilter.activeUser ,lastUpdatedSec:e.target.value} })
   };

   const handleUserIconFilterChange = (e) => {
    console.log("User Icon Filter Body",e.target.value)
    setUserFilter({...userFilter,userIconFilter:{...userFilter.userIconFilter ,isUserIconFilterSelected:e.target.checked} })
 };

 const userIconSelectedHandler = (e) => {
    //setLastUpdatedSec(e.target.value)
    console.log("user Icon Array Selected :" , e)
    setUserFilter({...userFilter,userIconFilter:{...userFilter.userIconFilter ,userIconArr:e} })
};

   const onSubmitHandler = ()=>{
    userFilterHandler();
    setIsUserFilterModalOpen(false)
   }

//    const userFilterHandler = ()=>{
//     let filteredUser = [...allUsersList]
//     console.log("filtered is working---",userFilter.activeUser.lastUpdatedSec);
//     if(allUsersList && isUserFilterChecked){
//       if(userFilter.activeUser.isActiveUser && userFilter.activeUser.lastUpdatedSec){
//         filteredUser = filteredUser.filter((data)=> Math.floor((new Date()-data.lastUpdated)/1000)<userFilter.activeUser.lastUpdatedSec)
//       }
//       if(userFilter.userInsideGeoFence){
//         // filteredUser = filteredUser.filter((data)=>{
//         console.log("gthj");
//         // })
//       }

//       setFilteredUsersList(filteredUser);
//       console.log("Filtered Userr:",filteredUser);
//     }
//   }

//   useEffect(()=>{
//     console.log("userfilter calling");
//     userFilterHandler();
//   },[allUsersList]);

//   useEffect(()=>{
//     console.log("userfilter calling");
//     userFilterHandler();
//   },[isUserFilterChecked]);
  
   return (
       <form className={classes.root}>
           <Grid container spacing={1}  justifyContent="flex-start" >
               {/* <Grid item xs={11}>
                <Typography variant="h6" component="div">
                    Active User
                </Typography>
               </Grid> */}
                {/* <Grid item xs={1} >
                   <FormControl>
                      <FormControlLabel
                            control={
                            <MuiCheckBox
                               color="primary"
                               // checked={isLastUpdatedUserFilter}
                               // onChange={handleLastUpdatedUserChange}
                               checked={userFilter.activeUser.isActiveUser}
                               onChange={handleActiveUserChange}
                           />}
                       />
                    </FormControl>
                </Grid> */}
 
                {/* {userFilter.activeUser.isActiveUser ? (
                   <Grid item xs={12}  >
                       <Grid item xs={4} >
                         <TextField
                           id="_sec"
                           label="sec"
                           type="text"
                           value={userFilter.activeUser.lastUpdatedSec}
                           onChange={secChangeHandler}
                        />
                       </Grid>
                   </Grid>
                ):null} */}
 
               <Grid item xs={11}>
                <Typography variant="h6" component="div">
                    User Inside Geo Fence 
                </Typography>
               </Grid>
                <Grid item xs={1} >
                   <FormControl>
                      <FormControlLabel
                            control={
                            <MuiCheckBox
                               color="primary"
                               //checked={isLastUpdatedUserFilter}
                               checked={userFilter.userInsideGeoFence}
                               onChange={ handleUserInsideGeoChange}
                           />}
                       />
                    </FormControl>
                </Grid>

                <Grid item xs={11}>
                <Typography variant="h6" component="div">
                    User Icon 
                </Typography>
               </Grid>

               <Grid item xs={1} >
                   <FormControl>
                      <FormControlLabel
                            control={
                            <MuiCheckBox
                               color="primary"
                               //checked={isLastUpdatedUserFilter}
                               checked={userFilter.userIconFilter.isUserIconFilterSelected}
                               onChange={ handleUserIconFilterChange}
                           />}
                       />
                    </FormControl>
                </Grid>

                {userFilter.userIconFilter.isUserIconFilterSelected ? (
                   <Grid item xs={11}  >
                        <Select
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                          //  defaultValue={[iconOptions[0]]}
                            isMulti
                            options={iconOptions}
                            onChange={ userIconSelectedHandler}
                            getOptionLabel={e => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  {
                                      <img src={e.icon} height="20px" width="20px"/>
                                  }
                                  <span style={{ marginLeft: 5 }}>{e.label}</span>
                                </div>
                              )}
                        />
                   </Grid>
                ):null}

               {/* <Grid item xs={11}>
                <Typography variant="h6" component="div">
                    Train Number 
                </Typography>
               </Grid>

               <Grid item xs={1} >
                   <FormControl>
                      <FormControlLabel
                            control={
                            <MuiCheckBox
                               color="primary"
                               //checked={isLastUpdatedUserFilter}
                               checked={userFilter.userIconFilter.isUserIconFilterSelected}
                               onChange={ handleUserIconFilterChange}
                           />}
                       />
                    </FormControl>
                </Grid> */}

                
                    <Grid item xs={5}/>
                    <Grid item xs={7}>
                    <Button variant="contained" size="large" style={{backgroundColor: "#eb9800" , fontFamily: 'Muli', color:'black',fontSize: "18px !important"}} onClick={onSubmitHandler}>
                       SUBMIT
                    </Button>
                    </Grid>
               
           </Grid>
       </form>
 )
}
 
export default UserFilterBody;