'use client'

import LoadingFullScreen from "@/layout_components/LoadingFullScreen";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Planner() {

    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/");
        }
    });
    const [response, setResponse] = useState("{}");
    const router = useRouter();

    if(status === "loading") {
        console.log("Session is loading or unauthenticated")
        return <LoadingFullScreen />
    }
    /*
    else if(session == null || status === "unauthenticated"){
        console.log("Session is null, returning to home")
        router.push("/");
    } 
    */
    else {
        console.log("Session is not null, continuing", session)
    }

    const getUserDetails = async (useToken: boolean) => {
        try {
            const response = await axios({
                method: "get",
                url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/user/",
                headers: useToken ? {Authorization: "Bearer " + session?.access_token} : {},
            });
            setResponse(JSON.stringify(response.data));
        } catch (error : any) {
            setResponse(error.message);
        }
    };

    

    return (
        <>
        <p>Welcome to the Simple Event Planner!</p>
        </>
    )
}