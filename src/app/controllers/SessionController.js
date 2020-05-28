import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    return res.json();
  }
}

export default new SessionController();
