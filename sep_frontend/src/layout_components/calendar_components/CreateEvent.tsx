
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment, { updateLocale } from 'moment'
import { Autocomplete, Box, Button, CircularProgress, Grid, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Add } from '@mui/icons-material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from 'sonner';
import axios from 'axios'
import FormErrorMessage from '../FormErrorMessage'
import useMainStore from '@/store/useMainStore'
import dayjs from 'dayjs' // For the MUI date picker

const localizer = momentLocalizer(moment)

// Modal Style, from the examples at the MIU documentation
const modal_style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// Types for the form elements
interface IFormInputs {
    title: string
    start_date: string
    end_date: string
    type_id: integer
}

const current_datetime = moment().toISOString()

const CalendarModalsAndForms = ({events, eventTypes, selectedEvent}: {events: any[], eventTypes: any[], selectedEvent: Object}) => {

    const [currentEventBeingEdited, setCurrentEventBeingEdited] = useState(selectedEvent ? selectedEvent : {
        id: null,
        title: "",
        start_date: current_datetime,
        end_date: current_datetime,
        type: null,
    })

    const [creationModalOpen, setCreationModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    //const [currentEditId, setCurrentEditId] = useState(null)
    const [currentModalType, setCurrentModalType] = useState(null)

    const access_token = useMainStore((state) => state.user_token)

    // Validation schema for the form elements
    const schema = yup
    .object().shape({
        title: yup.string().required("Title is required"),
        start_date: yup.string().required("Start date is required"),
        end_date: yup.string().required("End date is required"),
        // type has to be an id from eventTypes
        type_id: yup.number().required("Type is required").test("is-valid-type", "Invalid type", (value : any) => {
            return eventTypes.map(eventType => eventType.id).includes(value)
        }),
    })
    .required()

    // Form methods
    const { register, handleSubmit, control, reset, formState: { errors, isValid } } = useForm<IFormInputs>({
        defaultValues: {
            title: selectedEvent?.title,
            start_date: selectedEvent?.start_date,
            end_date: selectedEvent?.end_date,
            type_id: selectedEvent?.type_id,
        },
        resolver: yupResolver(schema),
        mode: "onBlur",
    })

    const onSubmitCreate: SubmitHandler<IFormInputs> = async (
        data,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setIsLoading(true);

        //signIn(); // This goes to default NextAuth UI
        let url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/";

        // Now we are ready to save the event
        let save_result = axios.post(url, {
            title: data.title,
            start_date: data.start_date,
            end_date: data.end_date,
            type: data.type_id,
        }, 
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        console.log("save_result return is", save_result);

        
        if(save_result == null || save_result?.error) {
            toast.error("Error creating this event");
            setIsLoading(false);
        }
        else if (save_result?.ok) {
            toast.success("Event created successfully");
            setIsLoading(false);
        }
        
    }

    const onSubmitUpdate: SubmitHandler<IFormInputs> = async (
        data,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setIsLoading(true);
        const url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/" + currentEventBeingEdited.id + "/";

        // Now we are ready to update the event
        let save_result = axios.post(url, {
            title: data.title,
            start_date: data.start_date,
            end_date: data.end_date,
            type: data.type_id,
        }, 
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        });

        console.log("save_result return is", save_result);

        
        if(save_result == null || save_result?.error) {
            toast.error("Error updating this event");
            setIsLoading(false);
        }
        else if (save_result?.ok) {
            toast.success("Event updated successfully");
            setIsLoading(false);
        }
        
    }
    
    // Template starts here
    return (
        <>
        <Modal 
            open={(type == "create") ? creationModalOpen : updateModalOpen}
            onClose={() => ((type == "create") ? setCreationModalOpen(false) : setUpdateModalOpen(false))}
            aria-labelledby={(type == "create") ? "creation_modal_title" : "update_modal_title"}
        >
            <Box
                sx={modal_style}
            >
                <Typography id={(type == "create") ? "creation_modal_title" : "update_modal_title"} variant="h6" component="h2">
                    {(type == "create") ? "New Event" : "Update Event"}
                </Typography>

                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        padding: 2,
                    }}
                    onSubmit={handleSubmit(type == "create" ? onSubmitCreate : onSubmitUpdate)}
                >
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => 
                            <>
                            <TextField label="Title" {...field} />
                            <FormErrorMessage errors={errors} name="title"/>
                            </>
                        }
                    />
                    <Controller
                        name="start_date"
                        control={control}
                        render={({ field }) => 
                            <>
                            <DateTimePicker
                                label="Start Date"
                                name="start_date"
                                defaultValue={moment()}
                            />
                            <FormErrorMessage errors={errors} name="start_date"/>
                            </>
                        }
                    />

                    <Controller
                        name="end_date"
                        control={control}
                        render={({ field }) => 
                            <>
                            <DateTimePicker
                                label="End Date"
                                name="end_date"
                                defaultValue={moment()}
                            />
                            <FormErrorMessage errors={errors} name="end_date"/>
                            </>
                        }
                    />

                    <Select
                        label="Type"
                        name="type_id"
                        sx={{width: "100%"}}
                        {...register("type_id")}
                    >
                        {eventTypes.map(eventType => 
                            <MenuItem 
                                key={eventType.id} 
                                value={eventType.id}
                                selected={eventType.id == currentEventBeingEdited.id}
                            >
                                    {eventType.title}
                            </MenuItem>
                        )}
                    </Select>

                
                    
                    <Button type="submit" disabled={isLoading || !isValid}>
                        {isLoading ? <CircularProgress /> : <span>Save</span> }
                    </Button>

                    {JSON.stringify(errors)} {JSON.stringify(isValid)}

                </Box>
            </Box>
        </Modal>
        
        </>
    )
}

export default CalendarModalsAndForms;