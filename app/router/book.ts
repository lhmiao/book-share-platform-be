import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/api/v1/book', controller.book.getBookList);
  router.get('/api/v1/book/:bookId', controller.book.getBookInfo);
  router.post('/api/v1/book', controller.book.createBook);
  router.put('/api/v1/book/:bookId', controller.book.updateBook);
};
