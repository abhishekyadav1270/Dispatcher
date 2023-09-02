import * as React from 'react';
import { TextField, Button, Box, FormLabel,FormControl, FormControlLabel, Radio, RadioGroup,Lin } from '@material-ui/core'
import { propTypes } from 'react-bootstrap/esm/Image';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function AskForDGNAPopup(props) {
    const [selectedAction, setSelectedAction] = React.useState("call")


    const onStartClicked = () =>{
        props.askDGNAAction(selectedAction)

    }
  const   onRadioSelect = (event) =>{
      setSelectedAction(event.target.value)

    }

  return (
    <Box sx={style}>
            <div>
  
      <FormLabel component="legend">Select An Action</FormLabel>
      <RadioGroup
        aria-label="gender"
        defaultValue="call"
        value={selectedAction}
        name="radio-buttons-group"
        onChange={onRadioSelect}
      >
        {/* <FormControlLabel value="call" control={<Radio />} label="Start call for selected group of user" /> */}
        <FormControlLabel value="fence" control={<Radio />} label="Create a fence" />
      </RadioGroup>
      <button
                    class="update-btn-profile"
                    type="button"
                    onClick={onStartClicked}
                >
                    START
                </button>
      </div>
      </Box>
  );
}
