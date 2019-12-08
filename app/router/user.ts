import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/api/v1/user/login', controller.user.login);
  router.get('/api/v1/user/logout', controller.user.logout);
  router.post('/api/v1/user/register', controller.user.createUser);
  router.patch('/api/v1/user', controller.user.updateUser);
  router.get('/api/v1/user/security_question', controller.user.getSecurityQuestion);
  router.put('/api/v1/user/password', controller.user.updatePassword);
};
