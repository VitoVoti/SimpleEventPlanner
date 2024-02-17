type EventFromBackend = {
    id: number,
    title: string,
    start_date: string,
    end_date: string,
    type: number | undefined,
    created: string,
    modified: string,
}

type EventForListView = {
    id: number,
    title: string,
    start_date: string,
    end_date: string,
    type_name: string,
    type: number,
    created: string,
    modified: string,
    color: string,

}

type EventForTimeLineView = {
    id: number,
    title: string,
    start: Date,
    end: Date,
    type: number,
    type_name: string,
    created: string,
    modified: string,
    allDay: boolean,
    color: string,
}

type EventTypeFromBackend = {
    id: number,
    title: string,
    color: string,
    created: string,
    modified: string,
}

type FilterTypes = {
    name: string | null,
    types: EventTypeFromBackend[],
    ignore_past: boolean,
}

interface MainStoreState {
    filters: FilterTypes;
    last_update_request_time: number | null,
    user_token: string | null,
    events: EventFromBackend[],
    event_types: EventTypeFromBackend[],
    filtered_events: EventFromBackend[],
    processed_events_for_list_view: EventForListView[],
    processed_events_for_timeline_view: EventForTimeLineView[],
    selected_event: EventFromBackend | null,

    setUserToken: (token : string) => void,
    setLastUpdateRequestTime: () => void,
    setEventsAndTypesOfEvents: (events : any[], event_types : any[]) => void,
    filterEvents: () => void,
    setSelectedEvent: (event : any) => void,
    clearSelectedEvent: () => void,
    setFilters: (filters : any) => void,
    resetFilters: () => void,
    
}

// Form inputs

interface LoginFormInputs {
    username: string
    password: string
}


// Types for the form elements
interface EventFormInputs {
    title: string
    start_date: string
    end_date: string
    type: number | undefined | null
}