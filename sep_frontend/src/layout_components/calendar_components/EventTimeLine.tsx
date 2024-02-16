'use client'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import { Box } from '@mui/material'
import useMainStore from '@/store/useMainStore'
import LoadingFullScreen from '../LoadingFullScreen'
import axios from 'axios'
import { toast } from 'sonner'

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const DnDCalendar = withDragAndDrop(Calendar)

const EventTimeLine = ({}) => {

    // react-big-calendar expects the events to be in a specific format
    // Also something important to consider: events must have a different start and end for them to be correctly draggable
    const processed_events_for_timeline_view = useMainStore((state) => state.processed_events_for_timeline_view)
    const events = useMainStore((state) => state.events)
    const event_types = useMainStore((state) => state.event_types)
    const access_token = useMainStore((state) => state.user_token)

    const selected_event = useMainStore((state) => state.selected_event)
    const setSelectedEvent = useMainStore((state) => state.setSelectedEvent)
    const clearSelectedEvent = useMainStore((state) => state.clearSelectedEvent)

    const setLastUpdateRequestTime = useMainStore((state) => state.setLastUpdateRequestTime)

    const handleSelectEvent = (event) => {
        // We can't pass the object directly, so we look for the one with the same id on the events array
        // This is not efficient (linear search), but it will do for now
        let event_in_original_format = events.find(e => e.id === event.id);
        setSelectedEvent(event_in_original_format);
    }

    const handleEventDrop = (args: EventInteractionArgs<object>) => {
        const { event, start, end } = args;
        console.log("Event dropped", { start, end }, event);

        let event_in_original_format = events.find(e => e.id === event.id);
        updateEvent(event.id, start, end);
        
    }

    async function updateEvent(event_id, new_start, new_end){
        const url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/" + event_id + "/";

        // To update we use patch
        let save_result = await axios.patch(url, {
            start_date: moment(new_start).toISOString(),
            end_date: moment(new_end).toISOString(),
        }, 
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        }).catch((error) => {
            console.log("Error updating event", error);
            return {error: error}
        });
        
        if(save_result == null || save_result?.error) {
            toast.error("Error updating this event");
        }
        else if (save_result?.status == 200) {
            toast.success("Event updated successfully");
            //reset();
            clearSelectedEvent(); 
        }
        setLastUpdateRequestTime();
        //setIsLoading(false);
        //setUpdateModalOpen(false);
    }

    return (
        <Box
        
        >
            {
                processed_events_for_timeline_view ? 
                <div style={{height: '800px'}}>
                <DnDCalendar
                    localizer={localizer}
                    events={processed_events_for_timeline_view}
                    startAccessor="start"
                    endAccessor="end"
                    length={1}
                    onSelectEvent={handleSelectEvent}
                    defaultView={Views.WEEK}
                    views={[Views.WEEK]}
                    selected={selected_event ? processed_events_for_timeline_view.find(e => e.id == selected_event.id) : null}

                    onEventDrop={handleEventDrop}
                    resizable={false}
                    
                />
                </div>
                :
                <LoadingFullScreen />
            }
            
        </Box>
    )
}

export default EventTimeLine;