const { body, validationResult } = require('express-validator')

const userValidationRules = () => {
  return [
    body('name', 'name doesn\'t exists').exists(),
    body('email', 'Invalid email').exists().isEmail(),
    body('password').exists().isLength({ min: 5 }),
  ]
}

const userValidationLogin = () => {

  return [
    body('email', 'Invalid email').isEmail(),
    body('password').isLength({ min: 5 }),
  ]
}

const userValidationUpdate = () => {

  return [
    body('email', 'Invalid email').optional().isEmail(),
    body('password').optional().isLength({ min: 5 }),
    body('name').optional(),
    body('role').optional().isIn(['ADMIN', 'USER'])
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  userValidationLogin,
  userValidationUpdate,
  validate,
}
