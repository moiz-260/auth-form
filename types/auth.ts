export interface SignUpFormData {
    fullName: string;
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInFormData {
    email: string;
    password: string;
}
