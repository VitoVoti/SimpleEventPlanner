import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel, GridValueGetterParams } from '@mui/x-data-grid';
import moment from "moment";
import useMainStore from "@/store/useMainStore";
import { Box } from "@mui/material";

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 90
    },
    {
        field: 'title',
        headerName: 'Title',
        width: 150,
    },
    {
        field: 'start_date',
        headerName: 'Start date',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
            `${moment(params.row.start_date).format('LLL')}`,
    },
    {
        field: 'end_date',
        headerName: 'End date',
        sortable: false,
        width: 160,
        valueGetter: (params: GridValueGetterParams) =>
            `${moment(params.row.end_date).format('LLL')}`,
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 150,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.type}`,

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
                }}
                pageSizeOptions={[10]}
                rowSelection
                // can select one at a time, and the selection is stored on the global store
                
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    console.log("newRowSelectionModel", newRowSelectionModel);
                    setSelectedEventModel(newRowSelectionModel);
                }}
                rowSelectionModel={selectedEventModel}
            />
            
        </Box>
    )
}

export default EventList;