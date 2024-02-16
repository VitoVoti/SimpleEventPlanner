import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel, GridvalueFormatterParams } from '@mui/x-data-grid';
import moment from "moment";
import useMainStore from "@/store/useMainStore";
import { Box } from "@mui/material";

// Columns for the table
const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90,
        disableColumnMenu: true,
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 150,
        disableColumnMenu: true,
    },
    {
        field: 'start_date',
        headerName: 'Start date',
        sortable: true,
        type: 'string',
        width: 160,
        valueFormatter: (params: GridvalueFormatterParams) =>
            `${moment(params.value).format('LLL')}`,
        sortComparator: (el1, el2) => el1.localeCompare(el2),
        disableColumnMenu: true,
    },
    {
        field: 'end_date',
        headerName: 'End date',
        sortable: true,
        type: 'string',
        width: 160,
        valueFormatter: (params: GridValueFormatterParams) =>
            `${moment(params.value).format('LLL')}`,
        disableColumnMenu: true,
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 150,
        disableColumnMenu: true,

    },
    {
        field: 'created',
        headerName: 'Created at',
        sortable: true,
        type: 'string',
        width: 160,
        valueFormatter: (params: GridvalueFormatterParams) =>
            `${moment(params.value).format('LLL')}`,
        disableColumnMenu: true,
    },
    {
        field: 'modified',
        headerName: 'Updated at',
        sortable: true,
        type: 'string',
        width: 160,
        valueFormatter: (params: GridvalueFormatterParams) =>
            `${moment(params.value).format('LLL')}`,
        disableColumnMenu: true,
    },

];


const EventList = () => {

    const events = useMainStore((state) => state.events)
    const processed_events_for_list_view = useMainStore((state) => state.processed_events_for_list_view)
    const selected_event = useMainStore((state) => state.selected_event)
    const setSelectedEvent = useMainStore((state) => state.setSelectedEvent)
    const clearSelectedEvent = useMainStore((state) => state.clearSelectedEvent)


    // MUI X Data Grid allows selecting, but uses an array instead of a single value
    // We use this state to store the selected event, and we keep it updated with a useEffect
    const [selectedEventModel, setSelectedEventModel] = useState<GridRowSelectionModel>(selected_event ? [selected_event.id] : []);
    useEffect(() => {
        if(selectedEventModel.length == 0){
            clearSelectedEvent();
        }
        else {
            const possible_element = events.find((event) => event.id === selectedEventModel[0]);
            setSelectedEvent(possible_element ? possible_element : null);
        
        }
    }, [selectedEventModel])
    // If another part of the UI changes selected_event, we also update the selectedEventModel
    useEffect(() => {
        setSelectedEventModel(selected_event ? [selected_event.id] : []);
    }, [selected_event])


    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={processed_events_for_list_view}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                    sorting: {
                        sortModel: [{ field: 'start_date', sort: 'asc' }],
                    },
                }}
                pageSizeOptions={[10]}

                // This is how the MUI X Data Grid does selection
                rowSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedEventModel(newRowSelectionModel);
                }}
                rowSelectionModel={selectedEventModel}
            />
            
        </Box>
    )
}

export default EventList;