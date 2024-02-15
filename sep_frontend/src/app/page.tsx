'use client'
import Image from "next/image";
//import CustomLink from "./layout_components/CustomLink
import Link from "../layout_components/Link";

import { useSession, signIn, signOut } from "next-auth/react"
import LoginForm from "@/layout_components/LoginForm";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import LoadingFullScreen from "@/layout_components/LoadingFullScreen";
import { useState } from "react";

export default function Home() {

	//const session = useSession();

	const {data: session, status} = useSession();

	const [disableButtons, setDisableButtons] = useState(false);

	// Special case: in development, sometimes we're logged in, the status is authenticated, but the user is not initialized yet. 
	// We keep the loading screen in the meantime, otherwise the UI will show the login form for a second.
	if((status === "loading") || (status === "authenticated" && session?.user == null)) {
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
	console.log("Session is", session, "status is", status, JSON.parse(JSON.stringify(session)));

	return (
		<>
		<Grid container spacing={2} justifyContent="center">
			
			<Grid item xs={12} md={6} order={{ sm: 2, md: 1 }}>
				<Stack direction="column" spacing={2} alignItems="center">
					<Box
						sx={{
							padding: "70px",
						}}
					>
						<Typography
						variant="h2"
						component="span"
						
					>
						The event planner you would 
							<Typography
								variant="h2"
								component="span"
								
								color="secondary"
							>	
								&nbsp;never&nbsp;
							</Typography> 
						use
						</Typography>

						<Box sx={{textAlign: "center", marginTop: "60px"}}>
							
							<Typography
								variant="h4"
								component="h2"
								sx={{textAlign: "center"}}
								gutterBottom
							>
								Not because it's bad, but because Google Calendar exists.
							</Typography>

							<Typography
								variant="h5"
								component="h3"
								gutterBottom
							>
							... and Outlook
							</Typography>
							
							<Typography
								variant="h6"
								component="h3"
								gutterBottom
							>
							... and iCloud
							</Typography>
							<Typography
								variant="h5"
								component="h3"
								gutterBottom
							>
							but here, we keep it simple!
							</Typography>
						</Box>
					</Box>
					
				</Stack>
			</Grid>
			<Grid item xs={12} md={6} order={{ sm: 1, md: 2 }} sx={{marginTop: {sm: "20px", md: "100px"}}}>
				
				{
					(session?.user && session?.access_token) ?
					<>
						<Stack direction="column" spacing={2} alignItems="center">
							<p
								// @ts-ignore // The types dont mention the username property
							>Welcome back {(session?.user?.username) ? (session.user.username) : ("an unknown user")} !</p>
							
							<Button
								LinkComponent={Link} 
								href="/planner"
							>
								Check my planner
							</Button>
							<Button 
								onClick={() => {
									setDisableButtons(true);
									signOut({
										callbackUrl: "/"
									});
								}}
								disabled={disableButtons}
							>
								Sign out
							</Button>
						</Stack>
						
					</>
					:
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center"
						}}
					>
						<LoginForm />
					</Box>
				}
			</Grid>
		</Grid>
		
		
		</>
	);
}
