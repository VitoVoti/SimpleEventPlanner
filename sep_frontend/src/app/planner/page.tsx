'use client'

import LoadingFullScreen from "@/layout_components/LoadingFullScreen";
import CalendarModalsAndForms from "@/layout_components/calendar_components/CalendarModalsAndForms";
import MainCalendarUI from "@/layout_components/calendar_components/MainCalendarUI";
import useMainStore from "@/store/useMainStore";
import { Container, Grid } from "@mui/material";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


// For date pickers
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

export default function Planner() {

    const setUserToken = useMainStore((state) => state.setUserToken)

    // Events and event types: storage and fetching
    const [events, setEvents] = useState([])
    const [eventTypes, setEventTypes] = useState([])

    // Process data for react-big-calendar format
    // We only do it if it has changed
    const processEvents = (events: any[]) => {
        let processedEvents = events.map(event => {
            let processedEvent = {
                id: event.id,
                title: event.name,
                start: new Date(event.start),
                end: new Date(event.end),
                allDay: false
            };
            return processedEvent;
        });
        return processedEvents;
    }
    const processedEvents = useMemo(() => processEvents(events), [events])

    // Current user session stuff
    const [sessionDataReady, setSessionDataReady] = useState(false);

    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        }
    });
    const [response, setResponse] = useState("{}");
    const router = useRouter();

    // At the start, fetch the events and event types
    useEffect(() => {
        console.log("useEffect, session is", JSON.parse(JSON.stringify(session)));
        if(session && session?.access_token) {
            console.log("Fetching events and event types")
            fetchEvents().then(data => {
                setEvents(data)
            })
            fetchEventTypes().then(data => {
                setEventTypes(data)
            })
            setUserToken(session.access_token);
            setSessionDataReady(true);
        }
    }, [session])

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

    // Special case: in development, sometimes we're logged in, the status is authenticated, but the user is not initialized yet. 
	// We keep the loading screen in the meantime, otherwise the UI will show the login form for a second.
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
        <p>Welcome to the Simple Event Planner!</p>
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    {JSON.stringify(eventTypes)}
                    <CalendarModalsAndForms events={events} eventTypes={eventTypes} />
                </Grid>
                <Grid item xs={12} md={9}>
                    <MainCalendarUI processedEvents={processedEvents} eventTypes={eventTypes} />
                </Grid>
                
                
            </Grid>
        </LocalizationProvider>
        </>
    )
}