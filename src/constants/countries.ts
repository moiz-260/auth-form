export interface Country {
    name: string;
    code: string;
    dialCode: string;
    flag: string;
}

export const countries: Country[] = [
    { name: "Afghanistan", code: "AF", dialCode: "+93", flag: "🇦🇫" },
    { name: "Albania", code: "AL", dialCode: "+355", flag: "🇦🇱" },
    { name: "Algeria", code: "DZ", dialCode: "+213", flag: "🇩🇿" },
    { name: "Andorra", code: "AD", dialCode: "+376", flag: "🇦🇩" },
    { name: "Angola", code: "AO", dialCode: "+244", flag: "🇦🇴" },
    { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
    { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
    { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
    { name: "Pakistan", code: "PK", dialCode: "+92", flag: "🇵🇰" },
    { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
    { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
    { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
    { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
    { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
    { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
    { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
    { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
    { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
    { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
];
