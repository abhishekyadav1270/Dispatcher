import React from 'react'

import { Box } from '@mui/material'
const Card = (props) => {
  const classes = props.className
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: '12px',
        fontSize: '14px',
        height: '100%',
        color: 'white',
        padding: '12px',
        overflowWrap: "break-word",
        overflow:"hidden"
      }}
      className={classes}
    >
      {props.children}
    </Box>
  )
}

export default Card