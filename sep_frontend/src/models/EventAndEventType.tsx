// These are simple functions to perform the CRUD operations

// Types for ToastT don't work well, as they dont have .error, .success, etc.
// We'll use any for now
import toast, { ToastT } from "sonner"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import axios, { AxiosResponse } from "axios";
import moment from "moment";

const fetchList = async (url: string, access_token: string | null, toast?: any, router?: AppRouterInstance) => {
    if (!access_token) {
        if (toast) toast.error("You are not logged in, please log in to continue");
        if (router) router.push("/");
    }
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const data = response.data
    return data
}

const fetchEvents = async (access_token : string | null,toast?: any, router?: AppRouterInstance) => {
    let url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/";
    return await fetchList(url, access_token, toast, router)
}
const fetchEventTypes = async (access_token : string | null, toast?: any, router?: AppRouterInstance) => {
    let url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "event-types/";
    return await fetchList(url, access_token, toast, router)
}

const deleteEvent = async (id: number | null, access_token: string | null, onSuccess: Function, toast?: any) => {
    // We need to delete the event
    const url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/" + id + "/";
    let delete_result = await axios.delete(url, {
        headers: {
            Authorization: `Bearer ${access_token}`
        },
    }).catch((error) => {
        return { error: error }
    });

    if (delete_result == null || (delete_result as AxiosResponse).status != 204) {
        if (toast) toast.error("Error deleting this event");
    }
    else if ((delete_result as AxiosResponse).status == 204) {
        if (toast) toast.success("Event deleted successfully");
        onSuccess();
    }
}

const updateEvent = async (data: EventFormInputs, id: number | null, access_token: string | null, onSuccess: Function, toast?: any) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_CORE_URL + "events/" + id + "/";

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
            return { error: error }
        });

    if (save_result == null || (save_result as AxiosResponse).status != 200) {
        if (toast) toast.error("Error updating this event");
    }
    else if ((save_result as AxiosResponse).status == 200) {
        if (toast) toast.success("Event updated successfully");
        onSuccess();
    }
}

const createEvent = async (data: EventFormInputs, access_token: string | null, onSuccess: Function, toast?: any) => {
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
            return { error: error }
        });

    if (save_result == null || (save_result as AxiosResponse).status !== 201) {
        toast.error("Error creating this event");
    } else if ((save_result as AxiosResponse).status === 201) {
        toast.success("Event created successfully");
        onSuccess();
    }
}

export { fetchEvents, fetchEventTypes, deleteEvent, updateEvent, createEvent }