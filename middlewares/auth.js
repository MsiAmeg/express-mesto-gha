const Jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../controllers/user');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    throw new ForbiddenError('sign in to access this resource');
  }

  let payload;
  try {
    payload = Jwt.verify(jwt, SECRET_KEY);
  } catch (err) {
    throw new ForbiddenError('sign in to access this resource');
  }

  req.user = payload;
  return next();
};
