const { check, validationResult } = require("express-validator");

exports.checkRegister = [
  check("firstName", "First name is required").not().isEmpty(),
  check("lastName", "Last name is required").not().isEmpty(),
  check("gender", "Please enter a valid gender")
    .isIn(["male", "female"])
    .optional(),
  check("address", "Address is required").not().isEmpty(),
  check("country", "Country is required").not().isEmpty(),
  check("state", "State is required").not().isEmpty(),
  check("birthDate", "Birth Date is required").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password must be at least 6 character or more").isLength({
    min: 6,
  }),
];

exports.checkLogin = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password must be at least 6 character or more").isLength({
    min: 6,
  }),
];

exports.checkPassword = [
  check(
    "currentPassword",
    "Current password must be at least 6 character or more"
  ).isLength({ min: 6 }),
  check(
    "newPassword",
    "New password must be at least 6 character or more"
  ).isLength({ min: 6 }),
];

exports.checkProfile = [
  check("firstName", "First Name cannot be empty").not().isEmpty().optional(),
  check("lastName", "Last Name cannot be empty").not().isEmpty().optional(),
  check("phoneNumber", "Please enter a valid phone number")
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
    .optional(),
  check("gender", "Please enter a valid gender")
    .isIn(["male", "female"])
    .optional(),
  check("status", "Please enter a valid status")
    .isIn(["married", "single", "relationship"])
    .optional(),
  check("birthdate", "Please enter a valid date")
    .matches(
      /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/
    )
    .optional(),
];

exports.checkText = [check("text", "Please add a text").not().isEmpty()];

exports.validationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
};
