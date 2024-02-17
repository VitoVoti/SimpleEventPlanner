'use client'

import LoadingFullScreen from "@/layout_components/LoadingFullScreen";
import CalendarModalsAndForms from "@/layout_components/calendar_components/CalendarModalsAndForms";
import MainCalendarUI from "@/layout_components/calendar_components/MainCalendarUI";
import useMainStore from "@/store/useMainStore";
import { AccountCircle, CalendarMonth, Code, ListAlt, PhoneMissed } from "@mui/icons-material";
import { Container, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

export default function About() {

    function T(props: {color: string, children: React.ReactNode}) {
        return <Typography variant="h6" component="span" color={props.color}>{props.children}</Typography>
    }

    const reasons = [
        {
            icon: <ListAlt/>,
            title: "List View by default",
            description: "Calendar view is so old, so we put a list view as default! Now you can waste time sorting through all your events to look for something, and realize that you might need a vacation."
        },
        {
            icon: <CalendarMonth/>,
            title: "Weekly calendar view",
            description: "Hate having to click through different views such as daily, weekly, monthly, etc.? Well, we have made the choice for you, there\'s only a weekly Timeline view!"
        },
        {
            icon: <AccountCircle/>,
            title: "So private, there\'s no registrations allowed",
            description: "This app is SO exclusive, we don\'t allow new sign-ups! Ever! That\'s how you know we don\'t harvest your data, or have a business model, or any plan for the future at all!"
        },
        {
            icon: <PhoneMissed/>,
            title: "No notifications",
            description: "No more annoying notifications, or any integrations at all! If you want to look at your calendar, open it yourself. Out of sight, out of mind."
        },
        {
            icon: <Code/>,
            title: "Open source",
            description: "You can trust me, because the code is open source! You can go and see it right now!... just don\'t look at the times I had to use \'any\' for types, I swear to god Typescript can be so annoying sometimes..."
        },
    ]

    return (
        <>
        <Container maxWidth="xl">
        <Grid container spacing={2} sx={{marginY: 2}}>
            <Grid item xs={12}>
                <Stack spacing={4}>
                    <Typography variant="h2" component={"h1"}>About</Typography>
                    <Typography variant="h6" component={"p"} sx={{textAlign: "center"}}>
                        Hey you! You&apos;ve used many calendar apps before. And they are all sooooooooo <T color="warning">complex!</T>
                    </Typography>
                    <Typography variant="h6" component={"p"} sx={{textAlign: "center"}}>
                        Remember that time when you made an event with someone, and it automatically created a Meet call? Or that time when your phone reminded you 30 minutes before without your consent?
                    </Typography>
                    <Typography variant="h6" component={"p"} sx={{textAlign: "center"}}>
                        Or that time when you made the event for <T color="error">10 PM</T> instead of 10 AM? Whoops...
                    </Typography>
                    <Typography variant="h6" component={"p"} sx={{marginY: 2, textAlign: "center"}}>
                        Well, I&apos;ve been there, and let me show you why <T color="primary">Simple Event Planner</T> is what you need 👍
                    </Typography>
                    <Grid item xs={12}>
                        <Typography sx={{ mt: 4, mb: 2 }} variant="h4" component="div">
                            REASONS (IN ALL CAPS) TO USE THIS WEB APP
                        </Typography>
                        <List
                            sx={{fontSize: "1.2rem"}}
                        >
                            {reasons.map((reason) =>
                                (
                                <ListItem
                                    key={reason.title}
                                >
                                    <ListItemIcon>
                                        {reason.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={reason.title}
                                        secondary={reason.description}
                                    />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </Grid>
                    <Typography variant="h6" component={"p"} sx={{textAlign: "center"}}>
                        If you aren&apos;t convinced yet, well, all I can say is that I&apos;ve put lots of effort for the past 5 days (in my free time) to make this happen.  But, the fact that you&apos;re reading this makes me happy that my work is reaching someone out there. Software is to be used, it&apos;s the legacy us programmers leave to the world. Even if you don&apos;t use this web app again!
                    </Typography>
                    <Typography variant="h6" component={"p"} sx={{textAlign: "center"}}>
                        Thank you for coming to my TED talk... I mean, thank you for using Simple Event Planner.
                    </Typography>
                </Stack>
            </Grid>
                
                
        </Grid>
        </Container>
        </>
    )
}