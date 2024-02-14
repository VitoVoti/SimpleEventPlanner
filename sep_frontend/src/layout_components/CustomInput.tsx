import { useForm, useController, UseControllerProps } from "react-hook-form"

function CustomInput(props: UseControllerProps<any>) {
    const { field, fieldState } = useController(props)
  
    return (
      <div>
        <input {...field} placeholder={props.name} />
        <p>{fieldState.isTouched && "Touched"}</p>
        <p>{fieldState.isDirty && "Dirty"}</p>
        <p>{fieldState.invalid ? "invalid" : "valid"}</p>
      </div>
    )
}

export default CustomInput;