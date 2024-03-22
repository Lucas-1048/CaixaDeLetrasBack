import * as yup from "yup";

export interface IUserLogin {
    email: string;
    password: string;
}

export const loginValidation: yup.ObjectSchema<IUserLogin> = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6).max(20),
});