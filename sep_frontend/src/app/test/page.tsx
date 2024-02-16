'use client'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import { Box, Grid, Tab, Tabs } from '@mui/material'
import useMainStore from '@/store/useMainStore'
import LoadingFullScreen from '../LoadingFullScreen'
import axios from 'axios'
import { toast } from 'sonner'
import React, { useState } from 'react'
import { ImportContacts } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const DnDCalendar = withDragAndDrop(Calendar)

let processed_events_for_timeline_view = [
    {
        title: "test1",
        start: new Date(2024, 2, 10, 10, 0),
        end: new Date(2024, 2, 10, 12, 0),
        id: 1,
        allDay: false,
    },
    {
        title: "test2",
        start: new Date(2024, 2, 13, 14, 0),
        end: new Date(2024, 2, 13, 16, 0),
        id: 2,
        allDay: false,
    },
    {
        title: "test3",
        start: new Date(2024, 2, 17, 18, 0),
        end: new Date(2024, 2, 17, 20, 0),
        id: 3,
        allDay: false,
    },


]

processed_events_for_timeline_view = 
[
    {
        "id": 1,
        "title": "Event One!",
        "start": "2024-02-14T11:30:00.000Z",
        "end": "2024-02-15T12:19:09.000Z",
        "type": "Movie night",
        "created": "2024-02-15T06:59:51.809897Z",
        "modified": "2024-02-16T11:17:36.425608Z",
        "allDay": false
    },
    {
        "id": 12,
        "title": "asdasd05",
        "start": "2024-02-05T06:15:29.000Z",
        "end": "2024-02-06T06:15:29.000Z",
        "type": "Meeting",
        "created": "2024-02-16T06:15:41.130844Z",
        "modified": "2024-02-16T09:14:08.598203Z",
        "allDay": false
    },
    {
        "id": 14,
        "title": "dxxdg",
        "start": "2024-02-17T00:00:00.000Z",
        "end": "2024-02-18T00:00:00.000Z",
        "type": "Movie night",
        "created": "2024-02-16T06:23:43.611761Z",
        "modified": "2024-02-16T11:31:49.347405Z",
        "allDay": false
    },
    {
        "id": 15,
        "title": "FFFFF",
        "start": "2024-02-16T14:30:00.000Z",
        "end": "2024-02-17T14:30:00.000Z",
        "type": "Movie night",
        "created": "2024-02-16T06:24:58.687955Z",
        "modified": "2024-02-16T11:41:31.605691Z",
        "allDay": false
    },
    {
        "id": 16,
        "title": "ggggg",
        "start": "2024-02-16T06:24:50.921Z",
        "end": "2024-02-16T07:34:50.921Z",
        "type": "Movie night",
        "created": "2024-02-16T06:25:12.178654Z",
        "modified": "2024-02-16T06:25:12.178779Z",
        "allDay": false
    },
    {
        "id": 17,
        "title": "dxxdgasda",
        "start": "2024-02-14T13:30:00.000Z",
        "end": "2024-02-15T13:30:00.000Z",
        "type": "Movie night",
        "created": "2024-02-16T06:26:51.667807Z",
        "modified": "2024-02-16T11:36:47.651404Z",
        "allDay": false
    },
    {
        "id": 18,
        "title": "464wtdfdg",
        "start": "2024-02-16T12:30:00.000Z",
        "end": "2024-02-17T12:30:00.000Z",
        "type": "Meeting",
        "created": "2024-02-16T06:27:21.685121Z",
        "modified": "2024-02-16T11:31:33.188515Z",
        "allDay": false
    },
    {
        "id": 19,
        "title": "fxfvxvfx",
        "start": "2024-02-12T12:30:00.000Z",
        "end": "2024-02-13T12:30:00.000Z",
        "type": "Meeting",
        "created": "2024-02-16T06:28:20.157554Z",
        "modified": "2024-02-16T11:31:38.195913Z",
        "allDay": false
    },
    {
        "id": 20,
        "title": "Event 4",
        "start": "2024-02-16T15:00:00.000Z",
        "end": "2024-02-17T15:00:00.000Z",
        "type": "Leisure",
        "created": "2024-02-16T08:55:44.658256Z",
        "modified": "2024-02-16T11:31:28.318970Z",
        "allDay": false
    },
    {
        "id": 21,
        "title": "asdasd",
        "start": "2024-02-23T08:55:03.000Z",
        "end": "2024-02-23T08:55:03.000Z",
        "type": "Training",
        "created": "2024-02-16T08:57:48.191455Z",
        "modified": "2024-02-16T09:16:44.975197Z",
        "allDay": false
    },
    {
        "id": 23,
        "title": "hkjkbj",
        "start": "2024-02-02T08:55:03.000Z",
        "end": "2024-02-03T08:55:03.000Z",
        "type": "Workshop",
        "created": "2024-02-16T08:58:13.611261Z",
        "modified": "2024-02-16T09:13:38.422404Z",
        "allDay": false
    },
    {
        "id": 24,
        "title": "jkbhjh",
        "start": "2024-02-13T13:30:00.000Z",
        "end": "2024-02-14T13:30:00.000Z",
        "type": "Meeting",
        "created": "2024-02-16T08:58:27.264180Z",
        "modified": "2024-02-16T11:40:58.916238Z",
        "allDay": false
    },
    {
        "id": 25,
        "title": "thirteen",
        "start": "2024-02-13T13:30:00.000Z",
        "end": "2024-02-15T06:12:00.000Z",
        "type": "Movie night",
        "created": "2024-02-16T09:44:48.503333Z",
        "modified": "2024-02-16T11:31:24.506729Z",
        "allDay": false
    }
]

function a11yProps(index: number) {
    return {
      id: `calendar_tab_${index}`,
      'aria-controls': `calendar_tabpanel-${index}`,
    };
}

const Test = () => {

    //const processed_events_for_timeline_view = useMainStore((state) => state.processed_events_for_timeline_view)
    // The data store can't store Date() objects, so we'll convert the ISO strings to date here
    const events = processed_events_for_timeline_view.map((event : any) => {
        return {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        }
    });

    console.log("processed_events_for_timeline_view", processed_events_for_timeline_view?.[0]?.["start"]);

    const handleSelectEvent = (event) => {
        console.log("Event selected", event);
    }

    const handleEventDrop = (args: EventInteractionArgs<object>) => {
        const { event, start, end } = args;
        console.log("Event dropped", { start, end }, event);
    }

    const [currentTab, setCurrentTab] = useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <>
        <p>Welcome to the Simple Event Planner!</p>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    {/* We pass this function, so we can trigger a re-fetch from the child component */}
                    <React.StrictMode>
                        <ImportContacts />
                    </React.StrictMode>
                </Grid>
                <Grid item xs={12} md={9}>


            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleChangeTab} aria-label="Calendar views, tab interface">
                    <Tab label="List view" {...a11yProps(0)} />
                    <Tab label="Timeline view" {...a11yProps(1)} />
                </Tabs>
            </Box>
            {currentTab === 0 &&
            <Box
            
            >
                <div
                style={{height: '800px'}}
                >
                    <DnDCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        length={1}
                        onSelectEvent={handleSelectEvent}
                        defaultView={Views.WEEK}
                        views={[Views.WEEK]}

                        onEventDrop={handleEventDrop}
                        onEventResize={() => console.log("Event resized")}
                        resizable={true}
                        
                    />
                </div>
            </Box>
            }

                </Grid>
                
                
                </Grid>
            </LocalizationProvider>
        </>
    );
}

export default Test;