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
import { fetchEventTypes, fetchEvents } from "@/models/EventAndEventType";
import { Session } from "next-auth";

export default function Planner() {

    // We use the global store to keep the user token, events and event types
    const user_token = useMainStore((state) => state.user_token)
    const setUserToken = useMainStore((state) => state.setUserToken)
    const setEventsAndTypesOfEvents = useMainStore((state) => state.setEventsAndTypesOfEvents)
    const filters = useMainStore((state) => state.filters)
    const filterEvents = useMainStore((state) => state.filterEvents)
    const last_update_request_time = useMainStore((state) => state.last_update_request_time)
    const setLastUpdateRequestTime = useMainStore((state) => state.setLastUpdateRequestTime)

    // NextAuth
    const {data: session, status, update} = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        }
    });
    const router = useRouter();

	// We call /session/ once the variable is ready, in case we need to trigger a token refresh

    const [hasUpdatedSession, setHasUpdatedSession] = useState(false);
    const [eventDataReady, setEventDataReady] = useState(false);

	useEffect(() => {
        // Trigger refresh the first time we enter (as useSession initializes), 
        // and if the token in the store is different
        // @ts-ignore // The types don't have the access_token property, but it's there
        if(!hasUpdatedSession || !session?.user){
            update();
            setHasUpdatedSession(true);
        }

        // If we already did an update, and we have a token, we trigger to fetch the event data
        // by setting last_update_request_time
        // We save them in the global store (Zustand) so we dont have to "drill-down" through all child components
        // updateAllData() also triggers filterEvents(), which creates the processed_events_for_list_view and processed_events_for_timeline_view
        // @ts-ignore // The types don't have the access_token property, but it's there
        if(hasUpdatedSession && session?.user) {
            setLastUpdateRequestTime();  
        }
        

		
	}, [session, hasUpdatedSession])
    

    // Every time last_update_request_time changes, we update the Event data
    // This can happen on any child component
    useEffect(() => {
        if(last_update_request_time == null || !hasUpdatedSession) return;
        updateAllData();
    }, [last_update_request_time])



    async function updateAllData(){
        // @ts-ignore // The types don't have the access_token property, but it's there
        if(session && session?.access_token) {
            // @ts-ignore // The types don't have the access_token property, but it's there
            let access_token = session.access_token;
            let promise_events = fetchEvents(access_token, toast, router);
            let promise_event_types = fetchEventTypes(access_token, toast, router);
            let promise_all = Promise.all([promise_events, promise_event_types]);
            promise_all.then((values) => {
                setEventsAndTypesOfEvents(values[0], values[1]);
                // @ts-ignore // The types don't have the access_token property, but it's there
                setUserToken(session.access_token);
                setEventDataReady(true);
            })
        }
    }

    // If filters change, we need to re-process the events for the list and timeline views
    // But NOT updateAllData
    useEffect(() => {
        filterEvents();
    }, [filters])
    

    // Show a loading screen while we wait for the session to be ready
    // @ts-ignore // The types don't have the unauthenticated option, but it's there
    if((session?.user && session?.access_token) == false) {
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
    // @ts-ignore // The types don't have the unauthenticated option, but it's there
    if(session == null || status === "unauthenticated" || session?.access_token == null){
        toast.error("You are not logged in, please log in to continue");
        router.push("/");
    } 


    return (
        <>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Container maxWidth="xl">
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
            </Container>
        </LocalizationProvider>
        </>
    )
}