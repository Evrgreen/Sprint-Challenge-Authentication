const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthUtils = require('./auth-model');

router.post('/register', async (req, res) => {
  try {
    const user = req.body;
    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    user.password = bcrypt.hashSync(user.password, ROUNDS);
    const createdUser = await AuthUtils.add(user);
    res
      .status(200)
      .json({ message: 'User Created successfully', user: createdUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: 'There was an error processing that request', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [user] = await AuthUtils.findBy({ username });
    console.log(user, password);
    if (bcrypt.compareSync(password, user.password)) {
      const token = await AuthUtils.generateToken(user);
      res.status(200).json({ message: 'Login Successful', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({
      message: `There was an error processing that request ${error}`,
      error,
    });
  }
});

module.exports = router;
