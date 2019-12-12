import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/api/v1/book_comment/:bookId', controller.bookComment.getBookCommentList);
  router.post('/api/v1/book_comment/:bookId', controller.bookComment.createBookComment);
  router.put('/api/v1/book_comment/:bookCommentId', controller.bookComment.updateBookComment);
  router.post('/api/v1/book_comment/:bookCommentId/action', controller.bookComment.processBookCommentAction);
};
