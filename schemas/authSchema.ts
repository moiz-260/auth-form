import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required").min(3, "Full name must be at least 3 characters"),
    username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
    phoneNumber: yup.string().required("Phone number is required").matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
    email: yup
        .string()
        .trim()
        .required("Email is required")
        .email("Invalid email address")
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            "Email must include a valid domain (e.g. user@example.com)"
        ).notOneOf(
            ["test@mailinator.com", "test@tempmail.com"],
            "Disposable emails are not allowed"
        ),

    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain  one uppercase letter and one special character"
    ),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

export const signInSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required("Email is required")
        .email("Invalid email address")
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            "Email must include a valid domain (e.g. user@example.com)"
        ).notOneOf(
            ["test@mailinator.com", "test@tempmail.com"],
            "Disposable emails are not allowed"
        ),
    password: yup.string().required('Password is required').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter and one special character"
    ),
});
