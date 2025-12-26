import * as yup from 'yup';
const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(today.getFullYear() - 1);
export const signUpSchema = yup.object().shape({
    fullName: yup
        .string()
        .required("Full name is required")
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .matches(/\S/, "Full name cannot be only spaces"),
    dateOfBirth: yup
        .date()
        .required("Date of birth is required")
        .max(today, "Date of birth cannot be in the future")
        .max(oneYearAgo, "You must be at least 1 year old"),
    phoneNumber: yup
        .string()
        .required("Phone number is required")
        .matches(
            /^\+\d{7,15}$/,
            "Invalid phone number (must include country code)"
        ),
    email: yup
        .string()
        .trim()
        .required("Email is required")
        .email("Invalid email address")
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            "Email must include a valid domain"
        ).notOneOf(
            ["test@mailinator.com", "test@tempmail.com"],
            "Disposable emails are not allowed"
        ),

    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one lowercase letter, one uppercase letter and one special character"
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
        "Password must contain at least 8 characters, one lowercase letter,one uppercase letter and one special character"
    ),
});
