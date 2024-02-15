
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Box, Tabs } from '@mui/material'
import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';


const localizer = momentLocalizer(moment)

function a11yProps(index: number) {
    return {
      id: `calendar_tab_${index}`,
      'aria-controls': `calendar_tabpanel-${index}`,
    };
}

const MainCalendarUI = ({processedEvents, eventTypes}: {processedEvents: any[], eventTypes: any[]}) => {

    return (
        <Box className="myCustomHeight">
            {/* 
            <Calendar
                localizer={localizer}
                events={processedEvents}
                startAccessor="start"
                endAccessor="end"
            /> 
            */}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="Calendar tabs">
                    <Tab label="List view" {...a11yProps(0)} />
                    <Tab label="Timeline view" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            
        </Box>
    )
}

export default MainCalendarUI;