// Validation of registration form by the EXPRESS VALIDATOR

const express = require("express");
const { check, validationResult } = require('express-validator')

const userValidationRules = () => {
  return [
   // name should be valid
   check('name',"It should be atleast 5 letters long , with no Spaces.").isLength({min:5}).trim().escape().not().isEmpty(),
    // username must be an email
    check('username').isEmail().normalizeEmail().isLength({ min: 10 }).withMessage("Username should be an email"),
    // password must be at least 5 chars long
   check('password').trim().isLength({ min: 5 }).withMessage("Password should have atleast 5 letters"),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push((err.msg)))
 

 res.locals.errors = extractedErrors;
 res.render("register")

}

module.exports = {
 userValidationRules,
 validate,
}