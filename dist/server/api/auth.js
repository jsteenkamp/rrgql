import express from 'express';
import config from 'config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';

const router = express.Router();

const testUser = {
  id: '61d482d0-08c7-11e6-9a2d-e3927e737b43',
  email: 'test@test.com',
  username: 'test',
  password: bcrypt.hashSync('test', 10),
  name: 'Test User',
  image: '',
  status: true,
  admin: false,
  emailVerified: false,
  locale: 'en'
};


// routes
router.post('/signin', (req, res) => {
  const {username, password} = req.body;
  if (username === testUser.username && bcrypt.compareSync(password, testUser.password)) {
    const user = _.omit(testUser, 'password');
    const token = jwt.sign(user, config.jwt.secret, {expiresIn: parseInt(config.jwt.expires, 10)});
    res.status(201).json({user, token});
  } else {
    res.status(401).json({message: 'Invalid username or password'});
  }
});


// todo - use auth path and set autho header to check
router.post('/verify', (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (err) {
        res.status(401).json({message: 'Token invalid'});
      } else {
        //  todo - db check user here and return token if valid
        res.json({user, token});
      }
    });
  } else {
    res.status(401).json({message: 'Token required'});
  }
});


// todo - socket clean up (session)
router.get('/signout', (req, res) => {
  //const { token } = req.body;
  res.json({message: 'Signed Out'});
});


export default router;