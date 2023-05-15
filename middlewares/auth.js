const Jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../controllers/user');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return res.status(401).send({ message: 'sign in to access this resource' });
  }

  let payload;
  try {
    payload = Jwt.verify(jwt, SECRET_KEY);
  } catch (err) {
    return res.status(401).send({ message: 'sign in to access this resource' });
  }

  req.user = payload;
  return next();
};
