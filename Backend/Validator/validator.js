import * as yup from "yup";

export const userSchema = yup.object({
  firstName: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .required("Username is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character ( @, $, !, %, *, ?, & )",
    )
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
