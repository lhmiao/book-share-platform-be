import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/api/v1/book', controller.book.getBookList);
  router.get('/api/v1/book/:bookId', controller.book.getBookInfo);
  router.post('/api/v1/book', controller.book.createBook);
  router.put('/api/v1/book/:bookId', controller.book.updateBook);
  router.get('/api/v1/book/:bookId/record_chain', controller.book.getBookRecordChain);
  router.get('/api/v1/book/:bookId/buy', controller.book.buyBook);
  router.get('/book/:bookId/preview', controller.book.getBookPreviewImg);
};
