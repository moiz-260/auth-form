export interface SignUpFormData {
    fullName: string;
    dateOfBirth: Date;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface SignInFormData {
    email: string;
    password: string;
}
