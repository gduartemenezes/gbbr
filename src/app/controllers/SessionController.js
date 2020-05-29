import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string.min(6).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Data Validation Failed, try again' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    // E-mail validation

    if (!user) {
      return res.status(400).json({ error: 'E-mail not found' });
    }
    // Password validation
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
