'use client'
import { Box, Button, Paper, TextField, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from 'sonner';
import { useState, createRef } from "react";
import ReCAPTCHA from 'react-google-recaptcha'

/*
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next"
import { getCsrfToken } from "next-auth/react"
import axios from "axios";
*/

const schema = yup
    .object({
        username: yup.string().required(),
        password: yup.string().required(),
        remember_me: yup.boolean().default(false),
    })
    .required()

interface IFormInputs {
    username: string
    password: string
    remember_me: boolean
}

const LoginForm = () => {

    const [isLoading, setIsLoading] = useState(false)

    const recaptcha_ref = createRef();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<IFormInputs>({
        defaultValues: {
            username: "",
            password: "",
            remember_me: false,
        },
        resolver: yupResolver(schema),
        mode: "onBlur",
    })

    const onRecaptchaChange = async (value: string | null) => {
        console.log("Recaptcha value is", value);
    };

    const onSubmit: SubmitHandler<IFormInputs> = async (
        data,
        event?: React.BaseSyntheticEvent
    ) => {
        event?.preventDefault();
        setIsLoading(true);

        const token = await recaptcha_ref.current.executeAsync();
        
        console.log("onSubmit, data is", data);
        console.log("token is", token);
        //signIn(); // This goes to default NextAuth UI
        //let signin_result = await axios.post("/api/auth/signin", data);
        let token_return = await signIn("credentials", { 
            redirect: false,
            username: data.username,
            password: data.password,
            recaptcha_response: token,
        })

        console.log("Token return is", token_return);

        if(token_return == null || token_return?.error) {
            toast.error("Error signing in. Please verify your credentials and try again.");
            console.log("Error signing in", token_return);
            setIsLoading(false);
        }
        else if (token_return?.ok) {
            toast.success("Successfully signed in!");
            console.log("Successfully signed in", token_return);
            setIsLoading(false);
        }
    }
    

    return (
        <Paper>
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
                onSubmit={handleSubmit(onSubmit)}
            >

                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => 
                            <TextField label="Username" {...field} />
                        }
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => 
                            <TextField label="Password" type="password" {...field} />
                        }
                    />
                    {/* 
                    <Controller
                        name="remember_me"
                        control={control}
                        render={({ field }) => 
                            <FormControlLabel control={<Checkbox {...field} />} label="Remember me" />
                        }
                    />
                    */}

                    <ReCAPTCHA
                        ref={recaptcha_ref}
                        size="invisible"
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={onRecaptchaChange}
                    />
                    
                    <Button type="submit" disabled={isLoading}>{isLoading ? <CircularProgress /> : <span>Sign in</span> }</Button>

            </Box>
        </Paper>
    );
}

export default LoginForm;