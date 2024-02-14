'use client'
import Image from "next/image";
//import CustomLink from "./layout_components/CustomLink
import Link from "../layout_components/Link";

import { useSession, signIn, signOut } from "next-auth/react"
import LoginForm from "@/layout_components/LoginForm";
import { Button } from "@mui/material";
import LoadingFullScreen from "@/layout_components/LoadingFullScreen";

export default function Home() {

	//const session = useSession();

	const {data: session, status} = useSession();

	// Special case: in development, sometimes we're logged in, the status is authenticated, but the user is not initialized yet. 
	// We keep the loading screen in the meantime, otherwise the UI will show the login form for a second.
	if((status === "loading") || (status === "authenticated" && session?.user == null)) {
		return <LoadingFullScreen />
	}
	console.log("Session is", session, "status is", status, JSON.parse(JSON.stringify(session)));

	return (
		<>
		<p>Welcome to SimpleEventPlanner!</p>
		{
			session?.user ? 
			<>
				<p>You are logged in as {JSON.stringify(session?.user)}</p>
				<Link href="/planner">Check my planner</Link>
				<Button onClick={() => signOut({
					callbackUrl: "/"
				})}>Sign out</Button>
			</>
			:
			<>
				<p>Please Login to use the planner</p>
				<LoginForm />
			</>
		}
		</>
	);
}
