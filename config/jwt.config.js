const jwt = require("jsonwebtoken");

function generateToken(user) {
  const { _id, typeOfUser } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "12h";

  return jwt.sign({ _id, typeOfUser }, signature, {
    expiresIn: expiration,
  });
}

module.exports = generateToken;
