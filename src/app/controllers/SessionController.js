import User from '../models/User';

class SessionController {
  async store(req, res) {
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
    });
  }
}

export default new SessionController();
