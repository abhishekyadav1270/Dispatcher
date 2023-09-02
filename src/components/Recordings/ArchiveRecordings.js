import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@material-ui/core';
import { EndPoints } from '../../MCXclient/endpoints';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from 'axios';
import './player.css'
import { useTheme } from "@material-ui/core/styles";
import ArchiveFileInfo from './ArchiveFileInfo';
import ArchiveRestore from './ArchiveRestore';
import PropTypes from "prop-types";

const ArchiveRecordings = () => {

    function TabPanel(tabprops) {
        const { children, value, index, ...other } = tabprops;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={5}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
        index2: PropTypes.any.isRequired
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            "aria-controls": `full-width-tabpanel-${index}`,
        };
    }

    const theme = useTheme();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

   
    return (
        <div className='w-100'>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Download Archive" {...a11yProps(0)} />
                    <Tab label="Restore Archive" {...a11yProps(1)} />
                </Tabs>
            </AppBar>

            <div class="tab1">
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ArchiveFileInfo />
                </TabPanel>

                <TabPanel value={value} index={1} dir={theme.direction}>
                    <ArchiveRestore/>
                </TabPanel>

            </div>
        </div>
    )
}

export default ArchiveRecordings;