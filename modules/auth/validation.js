export const Validator = {
    required: (value) => {
        return value && value.trim() !== "" ? true : "This field is required";
    },
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? true : "Invalid email address";
    },
    password: (value) => {
        return value.length >= 6 ? true : "Password must be at least 6 characters";
    },
    validateForm: (formData) => {
        const errors = {};
        if (formData.email) {
            const emailRes = Validator.email(formData.email);
            if (emailRes !== true) errors.email = emailRes;
        }

        if (formData.password) {
            const passRes = Validator.password(formData.password);
            if (passRes !== true) errors.password = passRes;
        }

        for (let key in formData) {
            const reqRes = Validator.required(formData[key]);
            if (reqRes !== true) errors[key] = reqRes;
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
};