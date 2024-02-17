'use client'
import { Calendar, EventProps, Views, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import { Box } from '@mui/material'
import useMainStore from '@/store/useMainStore'
import LoadingFullScreen from '../LoadingFullScreen'
import axios, { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { updateEvent } from '@/models/EventAndEventType'
import { Circle } from '@mui/icons-material'

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const DnDCalendar = withDragAndDrop(Calendar)

const EventTimeLine = ({ }) => {

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

    const handleSelectEvent = (event: EventFromBackend) => {
        // We can't pass the object directly, so we look for the one with the same id on the events array
        // This is not efficient (linear search), but it will do for now
        let event_in_original_format = events.find(e => e.id === event.id);
        setSelectedEvent(event_in_original_format);
    }

    const handleEventDrop = async (args: EventInteractionArgs<EventFromBackend>) => {
        const { event, start, end } = args;

        let event_in_original_format = events.find(e => e.id === event.id);
        if (!event_in_original_format) {
            return;
        }
        await updateEvent(
            {
                title: event_in_original_format.title,
                start_date: start.toString(),
                end_date: end.toString(),
                type: event_in_original_format.type
            },
            event.id,
            access_token,
            clearSelectedEvent,
            toast
        );
        setLastUpdateRequestTime();

    }

    // To customize how the events look
    const CustomEvent = ({event} : { event : any }) => (
        <div>
          <Circle sx={{ color: event.color, fontSize: '0.65em', marginRight: 1 }} />
          <span>{event.title}</span>
        </div>
    );

    return (
        <Box
        >
            {
                processed_events_for_timeline_view ?
                    <div style={{ height: '800px' }}>
                        <DnDCalendar
                            localizer={localizer}
                            events={processed_events_for_timeline_view}
                            // @ts-ignore // This is a known issue, the types are not updated
                            startAccessor="start"
                            // @ts-ignore // This is a known issue, the types are not updated
                            endAccessor="end"
                            length={1}
                            // @ts-ignore // This is a known issue, the types are not updated
                            onSelectEvent={handleSelectEvent}
                            defaultView={Views.WEEK}
                            views={[Views.WEEK]}
                            // @ts-ignore // This is a known issue, the types are not updated
                            selected={selected_event ? processed_events_for_timeline_view.find(e => e.id == selected_event.id) : null}
                            // @ts-ignore // This is a known issue, the types are not updated
                            onEventDrop={handleEventDrop}
                            resizable={false}

                            components={{
                                event: CustomEvent,
                            }}

                        />
                    </div>
                    :
                    <LoadingFullScreen />
            }

        </Box>
    )
}

export default EventTimeLine;