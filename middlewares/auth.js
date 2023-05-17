const Jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return next(new UnauthorizedError('sign in to access this resource'));
  }

  let payload;
  try {
    payload = Jwt.verify(jwt, process.env.SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError('sign in to access this resource'));
  }

  req.user = payload;
  return next();
};
