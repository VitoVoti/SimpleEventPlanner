import { ErrorMessage } from "@hookform/error-message";
import { ErrorOutline } from "@mui/icons-material";
import { Typography } from "@mui/material";

export default function FormErrorMessage({errors, name}: {errors: any, name: string}) {
    return (
        <ErrorMessage errors={errors} name={name} 
            render={ 
                ({ message }) => 
                <Typography color="error"><ErrorOutline sx={{verticalAlign:"middle"}}/> {message}</Typography>
            }
        />
    )
}