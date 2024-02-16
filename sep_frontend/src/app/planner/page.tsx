'use client'

import LoadingFullScreen from "@/layout_components/LoadingFullScreen";
import CalendarModalsAndForms from "@/layout_components/calendar_components/CalendarModalsAndForms";
import MainCalendarUI from "@/layout_components/calendar_components/MainCalendarUI";
import useMainStore from "@/store/useMainStore";
import { Container, Grid } from "@mui/material";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


// For date pickers
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

export default function Planner() {

    // We use the global store to keep the user token, events and event types
    const setUserToken = useMainStore((state) => state.setUserToken)
    const user_token = useMainStore((state) => state.user_token)
    const setEventsAndTypesOfEvents = useMainStore((state) => state.setEventsAndTypesOfEvents)
    //const processed_events_for_list_view = useMainStore((state) => state.processed_events_for_list_view)
    //const processed_events_for_timeline_view = useMainStore((state) => state.processed_events_for_timeline_view)
    const event_types = useMainStore((state) => state.event_types)
    const filterEvents = useMainStore((state) => state.filterEvents)
    const filters = useMainStore((state) => state.filters)
    const last_update_request_time = useMainStore((state) => state.last_update_request_time)
    const setLastUpdateRequestTime = useMainStore((state) => state.setLastUpdateRequestTime)


    // Toggles showing the rest of the components or not
    const [sessionDataReady, setSessionDataReady] = useState(false);

    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        }
    });
    const [response, setResponse] = useState("{}");
    const router = useRouter();
    
    // At the start, and every time session changes, fetch the access_token, events and event types
    // We save them in the global store (Zustand) so we dont have to "drill-down" through all child components
    // updateAllData() also triggers filterEvents(), which creates the processed_events_for_list_view and processed_events_for_timeline_view
    useEffect(() => {
        if(session?.access_token && (session?.access_token != user_token)) {
            console.log("useEffect, session is", JSON.parse(JSON.stringify(session)));
            setLastUpdateRequestTime();
        }
    }, [session])

    useEffect(() => {
        console.log("useEffect, last_update_request_time is", last_update_request_time);
        updateAllData();
    }, [last_update_request_time])

    async function updateAllData(){
        console.log("updateAllData called")
        if(session && session?.access_token) {
            console.log("Fetching events and event types")
            let promise_events = fetchEvents();
            let promise_event_types = fetchEventTypes();
            let promise_all = Promise.all([promise_events, promise_event_types]);
            promise_all.then((values) => {
                setEventsAndTypesOfEvents(values[0], values[1]);
                setUserToken(session.access_token);
                setSessionDataReady(true);
            })
        }
    }

    // If filters change, we need to re-process the events for the list and timeline views
    // But NOT updateAllData
    useEffect(() => {
        console.log("Filters changed, re-processing events")
        filterEvents();
    }, [filters])


    // Axios method, and other methods to fetch the data
    const fetchData = async (url : string) => {
        // @ts-ignore
        let access_token = session?.access_token;
        if(!access_token) {
            console.log("No access token, returning to home")
            toast.error("You are not logged in, please log in to continue");
            router.push("/");
        }
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        const data = response.data
        return data
    }
    const fetchEvents = async () => {
        let url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/";
        return await fetchData(url)
    }
    const fetchEventTypes = async () => {
        let url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "event-types/";
        return await fetchData(url)
    }

    // Special case: in development, sometimes we're logged in and the status is authenticated, but the user is not initialized yet. 
	// We keep the loading screen in the meantime, otherwise the UI will show as if we're logged in for a second.
	if(sessionDataReady == false || (status === "loading") || (status === "authenticated" && session?.user == null)) {
        console.log("Session is loading or unauthenticated, status", status, "session", session, "sessionDataReady", sessionDataReady)
        return (
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <LoadingFullScreen />
            </Container>
        )
    }
    else if(session == null || status === "unauthenticated"){
        console.log("Session is null, returning to home")
        toast.error("You are not logged in, please log in to continue");
        router.push("/");
    } 
    else {
        console.log("Session is not null, continuing", session)
    }


    

    

    return (
        <>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    {/* We pass this function, so we can trigger a re-fetch from the child component */}
                    <React.StrictMode>
                        <CalendarModalsAndForms />
                    </React.StrictMode>
                </Grid>
                <Grid item xs={12} md={9}>
                    <MainCalendarUI />
                </Grid>
                
                
            </Grid>
        </LocalizationProvider>
        </>
    )
}