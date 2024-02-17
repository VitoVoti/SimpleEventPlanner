
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Box, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import EventList from './EventList';
import EventTimeLine from './EventTimeLine';


const localizer = momentLocalizer(moment)

function a11yProps(index: number) {
    return {
      id: `calendar_tab_${index}`,
      'aria-controls': `calendar_tabpanel-${index}`,
    };
}

const MainCalendarUI = () => {

    const [currentTab, setCurrentTab] = useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginY: 3 }}>
                <Tabs value={currentTab} onChange={handleChangeTab} aria-label="Calendar views, tab interface">
                    <Tab label="List view" {...a11yProps(0)} />
                    <Tab label="Timeline view" {...a11yProps(1)} />
                </Tabs>
            </Box>
            {
                currentTab === 0 ? 
                <React.StrictMode>
                    <EventList /> 
                </React.StrictMode>
                :
                <EventTimeLine />
            }
            
        </Box>
    )
}

export default MainCalendarUI;