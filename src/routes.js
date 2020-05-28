import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ ok: true });
});
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Auth required
routes.put('/users', UserController.update);

export default routes;
