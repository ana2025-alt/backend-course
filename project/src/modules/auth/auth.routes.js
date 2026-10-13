// HTTP layer of the auth module: extracts the body, invokes the service
// and translates results. No SQL, no cryptography, no token internals.
import express from 'express';
import { register, login, getCurrentUser } from './auth.service.js';
<<<<<<< HEAD
=======
import { respondError } from '../../http/respond-error.js';
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
import { authenticate } from '../../middleware/authenticate.js';

const router = express.Router();

router.post('/register', async (req, res) => {
<<<<<<< HEAD
  res.status(201).json(await register(req.body));
});

router.post('/login', async (req, res) => {
  res.status(200).json(await login(req.body));
=======
  try {
    res.status(201).json(await register(req.body));
  } catch (error) {
    respondError(res, error);
  }
});

router.post('/login', async (req, res) => {
  try {
    res.status(200).json(await login(req.body));
  } catch (error) {
    respondError(res, error);
  }
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
});

// /auth/me is protected: it answers "who does the server think I am?".
router.get('/me', authenticate, async (req, res) => {
<<<<<<< HEAD
  res.status(200).json(await getCurrentUser(req.auth));
=======
  try {
    res.status(200).json(await getCurrentUser(req.auth));
  } catch (error) {
    respondError(res, error);
  }
>>>>>>> d8db7e933b589d710a723874feb9ae61c2a1d649
});

export default router;
