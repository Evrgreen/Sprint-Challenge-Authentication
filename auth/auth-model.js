const db = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/Secrets.js');

module.exports = {
  add,
  generateToken,
  findBy,
};

async function add(user) {
  try {
    const [id] = await db('users').insert(user);
    console.log(id);
    return await findBy({ id });
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function findBy(key) {
  try {
    return await db('users').where(key);
  } catch (error) {
    return error;
  }
}

function generateToken(user) {
  const payload = {
    username: user.username,
    department: user.department || 'user',
  };
  const secret = jwtSecret;
  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret, options);
}
