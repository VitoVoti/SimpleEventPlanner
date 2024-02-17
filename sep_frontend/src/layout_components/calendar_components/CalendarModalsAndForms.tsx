
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment, { updateLocale } from 'moment'
import { Autocomplete, Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, Input, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { debounce } from '@mui/material/utils'
import React, { ChangeEvent, SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { Add, Circle, Delete, Edit, Refresh } from '@mui/icons-material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AnyObjectSchema } from 'yup'
import { toast } from 'sonner';
import axios, { AxiosResponse } from 'axios'
import FormErrorMessage from '../FormErrorMessage'
import useMainStore from '@/store/useMainStore'
import dayjs from 'dayjs' // For the MUI date picker
import { useDebounce } from 'react-use'
import { createEvent, deleteEvent, updateEvent } from '@/models/EventAndEventType'
import EventTypeCircle from './EventTypeCircle'

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


const current_datetime = moment().toISOString()

const CalendarModalsAndForms = () => {

    const event_types = useMainStore((state) => state.event_types)
    const selected_event = useMainStore((state) => state.selected_event)
    const clearSelectedEvent = useMainStore((state) => state.clearSelectedEvent)
    const setLastUpdateRequestTime = useMainStore((state) => state.setLastUpdateRequestTime)
    const access_token = useMainStore((state) => state.user_token)
    const filters = useMainStore((state) => state.filters)
    const setFilters = useMainStore((state) => state.setFilters)

    // For refresh button but also used after CRUDs
    const updateAllDataAndClearSelection = function(){
        setIsLoading(true);
        clearSelectedEvent();
        setLastUpdateRequestTime();
        // After half a second we allow pressing buttons again, to avoid spam
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    // We dont want to search for every letter that the user types, so we use debounce
    const [currentNameFilter, setCurrentNameFilter] = useState(filters.name);
    const [, cancel] = useDebounce(
        () => {
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

    // Validation schema for the form elements
    const schema : AnyObjectSchema = yup.object().shape({
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
    const { register, handleSubmit, control, reset, formState: { errors, isValid }, getValues, setValue } = useForm<EventFormInputs>({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const clearCurrentFormData = () => {
        reset({
            title: "",
            start_date: current_datetime,
            end_date: moment(current_datetime).add(15, "minutes").toISOString(),
            type: undefined,
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
    const onSubmitCreate: SubmitHandler<EventFormInputs> = async (
        data,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setIsLoading(true);
        await createEvent(
            data, 
            access_token, 
            (() => {updateAllDataAndClearSelection();reset()}), 
            toast
        )
        setIsLoading(false);
        setCreationModalOpen(false);
        
    }

    // Submit for update
    const onSubmitUpdate: SubmitHandler<EventFormInputs> = async (
        data,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setIsLoading(true);
        await updateEvent(
            data, 
            currentEventBeingEdited.id, 
            access_token, 
            (() => {updateAllDataAndClearSelection();reset()}), 
            toast
        )
        setIsLoading(false);
        setUpdateModalOpen(false);
        
    }

    // "Submit" for delete, when confirming
    const deleteCurrentEvent = async (event?: React.BaseSyntheticEvent) => {
        event?.preventDefault();
        setIsLoading(true);
        await deleteEvent(
            currentEventBeingEdited.id, 
            access_token, 
            updateAllDataAndClearSelection, 
            toast
        )
        setIsLoading(false);
        setDeleteModalOpen(false);
    }

    // Methods to open modals and set data in forms

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

    // Render modals

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
                                {event_types.map(option => 
                                    <MenuItem 
                                        key={option.id} 
                                        value={option.id}
                                    >
                                        <EventTypeCircle color={option.color}/> {option.title}
                                    </MenuItem>
                                )}
                                
                            </Select>
                            <FormErrorMessage errors={errors} name="type"/>
                            </>
                        }
                    />
                    
                
                    
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

    
        

    
    return (
        <>
        <Grid container spacing={2} sx={{ marginY: 2 }}>
            <Grid item xs={12} sm={6} md={12}>
                <Stack direction="column" spacing={2} alignItems="center" justifyContent="center">

                    <Button 
                        variant="contained"
                        color="info"
                        onClick={() => updateAllDataAndClearSelection()}
                        disabled={isLoading}
                        sx={{width: "100%"}}
                        startIcon={<Refresh />}
                    >
                        <span>Refresh</span>
                    </Button>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => startCreation()}
                        sx={{width: "100%"}}
                        startIcon={<Add />}
                    >
                        <span>New Event</span>
                    </Button>
                    
                    <Button 
                        variant="contained" 
                        disabled={selected_event == null}
                        color="secondary" 
                        onClick={() => startUpdate()}
                        sx={{width: "100%"}}
                        startIcon={<Edit />}
                    >
                        <span>Update Event</span>
                    </Button>

                    <Button 
                        variant="contained" 
                        disabled={selected_event == null}
                        color="error" 
                        onClick={() => startDeletition()}
                        sx={{width: "100%"}}
                        startIcon={<Delete />}
                    >
                        <span>Delete Event</span>
                    </Button>

                    <Button 
                        variant="contained" 
                        disabled={selected_event == null}
                        color="secondary" 
                        onClick={() => clearSelectedEvent()}
                        sx={{width: "100%"}}
                    >
                        <span>Clear selection</span>
                    </Button>
                    
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
                <Paper sx={{ padding: 2 }}>
                    <Stack direction="column" spacing={2} alignItems="center">
                        <Typography variant="h6" component="h2">
                            Filters
                        </Typography>
                        <FormControl

                        >
                            <Autocomplete
                                id="event_type_filter"
                                multiple={true}
                                options={event_types}
                                getOptionLabel={(option) => option.title}
                                renderInput={(params) => 
                                    <TextField {...params} InputLabelProps={params.InputLabelProps} label="Filter by Event Types..."/>
                                }
                                renderOption={(props, option, { selected }) => (
                                    <li 
                                    {...props}
                                    >
                                        <EventTypeCircle color={option.color}/>
                                        {
                                            selected ?
                                            <strong>{option.title}</strong>
                                            :
                                            <span>{option.title}</span>
                                        }
                                    </li>
                                )}
                                onChange={(event, value : EventTypeFromBackend[]) => setFilters({types: value})}
                                value={filters.types ? filters.types : []}
                                sx={{minWidth: 200, maxWidth: "100%"}}
                            />
                        </FormControl>
                        
                        
                        <Input
                            type="text"
                            placeholder="Filter by Title..."
                            onChange={(event) => setCurrentNameFilter(event.target.value)}
                            value={currentNameFilter ? currentNameFilter : ""}
                            sx={{width: "100%"}}
                        />

                        <FormControlLabel 
                            checked={filters.ignore_past ? true : false}
                            onChange={(event: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent<Element, Event>) => setFilters({ignore_past: (event.target as HTMLInputElement).checked})}
                            control={<Checkbox />} 
                            label="Don't show past events" 
                        />

                        <Button variant="contained" color="info" onClick={() => setFilters({
                            types: [],
                            name: null,
                            ignore_past: false
                        })}
                            sx={{display: "flex", gap: 1}}
                        >
                            <span> Clear filters</span>
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