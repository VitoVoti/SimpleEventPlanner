import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import moment from 'moment'




// Here we hold the current user's data, and Event data to share between components
const useMainStore = create<MainStoreState>()(
    persist(
        (set, get) => ({
            // Epoch time of the last time we updated the events
            // We will observe this variable to see if we need to update the events
            last_update_request_time: null,

            // Shared data
            user_token: null,
            events: [],
            event_types: [],
            filtered_events: [],
            processed_events_for_list_view: [],
            processed_events_for_timeline_view: [],
            selected_event: null,
            filters: {
                name: null,
                types: [],
                ignore_past: false,
            },


            setUserToken: (token : string) => set(() => ({
                user_token: token
            })),

            setLastUpdateRequestTime: () => {
                set(() => ({
                    last_update_request_time: moment().unix()
                }));
            },

            setEventsAndTypesOfEvents(events : EventFromBackend[], event_types : EventTypeFromBackend[]) {
                set(() => ({
                    events: events,
                    event_types: event_types,
                }))
                get().filterEvents();
            },

            // We apply the filters on the events, and then we process them for the list and timeline views
            // We call this when filters change, or when events change, or when event_types change
            filterEvents: () => {
                let filtered_list = get().events;
                let filters = get().filters;
                let event_types = get().event_types;

                const now = moment();

                // We are going to implement a very simple filter.
                // It's not very efficient. But at least we short-circuit when we already have a keep = false
                // These filters will show anything between the selected dates
                // For example, an even that starts January 1st and ends in January 10th will be shown if we select January 5th as start_date_rage
                let ids_to_keep : number[] = [];
                let types_on_filters_ids: number[] = []

                if(filters.types){
                    types_on_filters_ids = filters.types.filter(e => e).map((type : EventTypeFromBackend) => type.id);
                }

                for (let event of filtered_list) {
                    let keep = true;

                    if (filters.types && filters.types.length > 0 && event.type && types_on_filters_ids.includes(event.type) == false) {
                        keep = false;
                    }
                    else if (keep && filters.ignore_past && moment(event.end_date).isAfter(now) == false) {
                        keep = false;
                    }
                    else if (keep && filters.name && event.title.includes(filters.name) == false) {
                        keep = false;
                    }

                    if (keep){
                        ids_to_keep.push(event.id);
                    }
                }
                
                
                filtered_list = filtered_list.filter((event: any) => ids_to_keep.includes(event.id)); 

                // Process data for the List View, which is just a table
                let processed_events_for_list_view = filtered_list.map((event : any) => {
                    let current_event = event_types.find(type => type.id === event.type);
                    return {
                        id: event.id,
                        title: event.title,
                        start_date: event.start_date,
                        end_date: event.end_date,
                        type_name: current_event ? current_event.title : "",
                        type: event.type,
                        created: event.created,
                        modified: event.modified,
                        color: current_event ? current_event.color : "white",
                    }
                });
                // Process data for react-big-calendar format
                let processed_events_for_timeline_view = filtered_list.map((event : any) => {
                    let current_event = event_types.find(type => type.id === event.type);
                    return {
                        id: event.id,
                        title: event.title,
                        start: moment(event.start_date).toDate(),
                        end: moment(event.end_date).toDate(),
                        type: event.type,
                        type_name: current_event ? current_event.title : "",
                        created: event.created,
                        modified: event.modified,
                        allDay: false,
                        color: current_event ? current_event.color : "white",
                    }
                });

                set(() => ({
                    filtered_events: filtered_list,
                    processed_events_for_list_view: processed_events_for_list_view,
                    processed_events_for_timeline_view: processed_events_for_timeline_view
                }))
            },
                

            setSelectedEvent: (event : any) => set(() => ({
                selected_event: event
            })),
            clearSelectedEvent: () => set(() => ({
                selected_event: null
            })),
            // We only add whatever we have, and not the whole state
            setFilters: (filters : any) => set((state: { filters: any; }) => ({
                filters: {...state.filters, ...filters }
            })),
            resetFilters: () => set(() => ({
                filters: {
                    name: null,
                    types: [],
                    ignore_past: false,
                }
            })),


        }),

        {
            name: 'sep-data-' + process.env.NODE_ENV.toLowerCase(), // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
)

export default useMainStore