import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Box } from '@mui/material'
import useMainStore from '@/store/useMainStore'

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const EventTimeLine = () => {

    const processed_events_for_timeline_view = useMainStore((state) => state.processed_events_for_timeline_view)
    const event_types = useMainStore((state) => state.event_types)

    return (
        <Box
        sx={{
            minHeight: '800px',
        }}
        >
            <Calendar
                localizer={localizer}
                events={processed_events_for_timeline_view}
                startAccessor="start"
                endAccessor="end"
            />
        </Box>
    )
}

export default EventTimeLine;