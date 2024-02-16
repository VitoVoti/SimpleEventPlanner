
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment, { updateLocale } from 'moment'
import { Autocomplete, Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, Input, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { debounce } from '@mui/material/utils'
import { useEffect, useMemo, useState } from 'react'
import { Add, Delete, Edit, Refresh } from '@mui/icons-material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from 'sonner';
import axios from 'axios'
import FormErrorMessage from '../FormErrorMessage'
import useMainStore from '@/store/useMainStore'
import dayjs from 'dayjs' // For the MUI date picker
import { useDebounce } from 'react-use'

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
    type: number
}

const current_datetime = moment().toISOString()

const CalendarModalsAndForms = () => {

    const event_types = useMainStore((state) => state.event_types)
    const selected_event = useMainStore((state) => state.selected_event)
    const clearSelectedEvent = useMainStore((state) => state.clearSelectedEvent)
    const setLastUpdateRequestTime = useMainStore((state) => state.setLastUpdateRequestTime)

    const filters = useMainStore((state) => state.filters)
    const setFilters = useMainStore((state) => state.setFilters)

    const updateAllDataAndClearSelection = function(){
        console.log("updateAllDataAndClearSelection called")
        clearSelectedEvent();
        //updateAllData();
        setLastUpdateRequestTime();
    }

    /*
    function debounceNameFilter(value : string, delay : number){
        console.log("debounceNameFilter", value, delay);
        debounce((value) => {
            setFilters({name: value})
        }, delay);
    }

    const debounceNameFilter = useCallback(debounce(setFilters({name: value}), 2000), []);
    */

    // We dont want to search for every letter that the user types, so we use debounce
    const [currentNameFilter, setCurrentNameFilter] = useState(filters.name);
    const [, cancel] = useDebounce(
        () => {
            console.log("after debounce, use setFilters")
            setFilters({name: currentNameFilter})
        },
        500,
        [currentNameFilter]
    );
    useEffect(() => {
        // if filters.name changes and its different from currentNameFilter, we update currentNameFilter
        if(filters.name != currentNameFilter){
            setCurrentNameFilter(filters.name);
        }
    }, [filters.name])

    // States for the modals
    const [creationModalOpen, setCreationModalOpen] = useState(false)
    const [updateModalOpen, setUpdateModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const access_token = useMainStore((state) => state.user_token)

    // Validation schema for the form elements
    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        start_date: yup.string().required("Start date is required"),
        // We need to validate that end_date is after the start date, and not before, and not the same (at least 1 minute difference)
        end_date: yup.string()
            .required("End date is required")
            .test("is-valid-end-date", "End date must be after start date", (value : any) => {
            return getValues("start_date") && value && moment(value).isAfter(moment(getValues("start_date")), "minute")
        }),
        // type has to be an id from event_types
        type: yup.number()
            .required("Type is required")
            .test("is-valid-type", "Invalid type", (value : any) => {
                return event_types.map(eventType => eventType.id).includes(value)
            }
        ),
    })
    .required()

    // Form methods
    const { register, handleSubmit, control, reset, formState: { errors, isValid }, getValues, setValue } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const clearCurrentFormData = () => {
        reset({
            title: "",
            start_date: current_datetime,
            end_date: moment(current_datetime).add(15, "minutes").toISOString(),
            type: null,
        });
    };
    const setCurrentFormDataAccordingToSelectedEvent = () => {
        reset({
            title: selected_event?.title,
            start_date: selected_event?.start_date,
            end_date: selected_event?.end_date,
            type: selected_event?.type,
        });
    }

    // If we have selected an event, we copy the current data, so we can use it as a default for the form
    const currentEventBeingEdited = useMemo(() => { 
        
        if(selected_event){
            console.log("selected_event is", selected_event)
            const new_prefilled_data = {
                id: selected_event?.id,
                title: selected_event?.title,
                start_date: moment(selected_event?.start_date).toISOString(),
                end_date: moment(selected_event?.end_date).toISOString(),
                type: selected_event?.type,
            
            };
            setCurrentFormDataAccordingToSelectedEvent();
            return new_prefilled_data;
        }
        else {
            return {
                id: null,
                title: "",
                start_date: current_datetime,
                end_date: moment(current_datetime).add(15, "minutes").toISOString(),
                type: null,
            };
        }
    }, [selected_event])

    // Submit for creation
    const onSubmitCreate: SubmitHandler<IFormInputs> = async (
        data,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setIsLoading(true);

        let url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/";

        let save_result = await axios.post(url, {
            title: data.title,
            start_date: moment(data.start_date).toISOString(),
            end_date: moment(data.end_date).toISOString(),
            type: data.type,
        }, 
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        }).catch((error) => {
            console.log("Error creating event", error);
            return {error: error}
        });

        console.log("create return is", save_result);

        
        if(save_result == null || save_result?.error) {
            toast.error("Error creating this event");
        }
        else if (save_result?.status == 201) {
            toast.success("Event created successfully");
            reset();
            updateAllDataAndClearSelection();
        }
        setIsLoading(false);
        setCreationModalOpen(false);
        
    }

    // Submit for update
    const onSubmitUpdate: SubmitHandler<IFormInputs> = async (
        data,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setIsLoading(true);
        const url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/" + currentEventBeingEdited.id + "/";

        // To update we use patch
        let save_result = await axios.patch(url, {
            title: data.title,
            start_date: moment(data.start_date).toISOString(),
            end_date: moment(data.end_date).toISOString(),
            type: data.type,
        }, 
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        }).catch((error) => {
            console.log("Error updating event", error);
            return {error: error}
        });

        console.log("update return is", save_result);

        
        if(save_result == null || save_result?.error) {
            toast.error("Error updating this event");
        }
        else if (save_result?.status == 200) {
            toast.success("Event updated successfully");
            reset();
            updateAllDataAndClearSelection();
        }
        setIsLoading(false);
        setUpdateModalOpen(false);
        
    }

    const startCreation = () => {
        clearCurrentFormData();
        setCreationModalOpen(true);
    }

    const startUpdate = () => {
        setCurrentFormDataAccordingToSelectedEvent();
        setUpdateModalOpen(true);
    }

    const startDeletition = () => {
        setDeleteModalOpen(true);
    }

    const renderInsideModal = (type: string) => {
        return (
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
                                defaultValue={field?.value ? moment(field?.value) : moment()}
                                onChange={field.onChange}
                                inputRef={field.ref}
                                value={field?.value ? moment(field?.value) : moment().add(15, "minutes")}
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
                                defaultValue={field?.value ? moment(field?.value) : moment()}
                                onChange={field.onChange}
                                inputRef={field.ref}
                                value={field?.value ? moment(field?.value) : moment().add(15, "minutes")}
                                
                            />
                            <FormErrorMessage errors={errors} name="end_date"/>
                            </>
                        }
                    />
                    {/* 
                    <Select
                        label="Type"
                        sx={{width: "100%"}}
                        {...register("type")}
                        value={getValues("type")}
                    >
                        {event_types.map(eventType => 
                            <MenuItem 
                                key={eventType.id} 
                                value={eventType.id}
                            >
                                {eventType.title}
                            </MenuItem>
                        )}
                                
                    </Select>
                    <FormErrorMessage errors={errors} name="type"/>
                    */}
                    
                    
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => 
                            <>
                            <Select
                                label="Type"
                                sx={{width: "100%"}}
                                {...field}
                            >
                                {event_types.map(eventType => 
                                    <MenuItem 
                                        key={eventType.id} 
                                        value={eventType.id}
                                    >
                                        {eventType.title}
                                    </MenuItem>
                                )}
                                
                            </Select>
                            <FormErrorMessage errors={errors} name="type"/>
                            </>
                        }
                    />

                    {JSON.stringify(errors)}
                    
                
                    
                    <Button type="submit" disabled={isLoading || !isValid}>
                        {isLoading ? <CircularProgress /> : <span>Save</span> }
                    </Button>

                </Box>
            </Box>
        </Modal>
        )
    };

    const renderDeleteModal = () => {
        return (
        <Modal 
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            aria-labelledby="delete_modal_title"
        >
            <Box
                sx={modal_style}
            >
                <Typography id="delete_modal_title" variant="h6" component="h2">
                    Delete Event {currentEventBeingEdited.title}
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
                    onSubmit={deleteCurrentEvent}
                >
                    <Typography variant="body1" component="p">
                        Are you sure you want to delete this event?
                    </Typography>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <CircularProgress /> : <span>Delete</span> }
                    </Button>
                </Box>
            </Box>
        </Modal>
        )
    }

    const deleteCurrentEvent = async (event?: React.BaseSyntheticEvent) => {
        event?.preventDefault();
        setIsLoading(true);
        // We need to delete the event
        const url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/" + currentEventBeingEdited.id + "/";
        let delete_result = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
        }).catch((error) => {
            console.log("Error deleting event", error);
            return {error: error}
        });

        console.log("delete_result return is", delete_result)

        if(delete_result == null || delete_result?.error) {
           toast.error("Error deleting this event");
        }
        else if (delete_result?.status == 204) {
            toast.success("Event deleted successfully");
            updateAllDataAndClearSelection();
        }
        setIsLoading(false);
        setDeleteModalOpen(false);
    }
        

    
    return (
        <>
        <Grid container spacing={2}>
            <Grid item>
                <Stack direction="column" spacing={2} alignItems="center">

                    <Button variant="contained" color="info" onClick={() => updateAllDataAndClearSelection()}
                        sx={{display: "flex", gap: 1}}
                    >
                        <Refresh /><span> Refresh</span>
                    </Button>

                    <Button variant="contained" color="primary" onClick={() => startCreation()}>
                        <Add /><span> New Event</span>
                    </Button>
                    
                    <Button 
                        variant="contained" 
                        disabled={selected_event == null}
                        color="secondary" 
                        onClick={() => startUpdate()}
                    >
                        <Edit /><span> Update Event</span>
                    </Button>

                    <Button 
                        variant="contained" 
                        disabled={selected_event == null}
                        color="error" 
                        onClick={() => startDeletition()}
                    >
                        <Delete /><span> Delete Event</span>
                    </Button>

                    <Button 
                        variant="contained" 
                        disabled={selected_event == null}
                        color="secondary" 
                        onClick={() => clearSelectedEvent()}
                    >
                        <span>Clear selection</span>
                    </Button>
                    
                </Stack>
            </Grid>
            <Grid item>
                <Paper sx={{ padding: 2 }}>
                    <Stack direction="column" spacing={2} alignItems="center" sx={{marginTop: "30px"}}>
                        <Typography variant="h6" component="h2">
                            Filters
                        </Typography>
                        <Autocomplete
                            id="event_type_filter"
                            options={event_types}
                            getOptionLabel={(option) => option.title}
                            renderInput={(params) => <TextField {...params} InputLabelProps={params.InputLabelProps} label="Filter by Event Type..." />}
                            onChange={(event, value) => setFilters({type: value?.id})}
                            value={event_types.find(eventType => eventType.id === filters.type) ? event_types.find(eventType => eventType.id === filters.type) : null}
                            sx={{width: "100%"}}
                        />
                        <Input
                            type="text"
                            placeholder="Filter by Title..."
                            onChange={(event) => setCurrentNameFilter(event.target.value)}
                            value={currentNameFilter ? currentNameFilter : ""}
                            sx={{width: "100%"}}
                        />

                        <FormControlLabel 
                            checked={filters.ignore_past ? true : false}
                            onChange={(event) => setFilters({ignore_past: event.target.checked})}
                            inputProps={{ 'aria-label': 'controlled' }}
                            control={<Checkbox />} 
                            label="Don't show past events" 
                        />

                        <Button variant="contained" color="info" onClick={() => setFilters({
                            type: null,
                            name: null,
                            ignore_past: false
                        })}
                            sx={{display: "flex", gap: 1}}
                        >
                            <Refresh /><span> Clear filters</span>
                        </Button>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
        {
            renderInsideModal("create")
        }
        {
            renderInsideModal("update")
        }
        {
            renderDeleteModal()
        }
        </>
    )
}

export default CalendarModalsAndForms;