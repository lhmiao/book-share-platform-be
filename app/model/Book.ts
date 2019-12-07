export default app => {
  const { INTEGER, STRING, BLOB, TEXT, JSON: JSON_TYPE } = app.Sequelize;

  const Book = app.model.define('book', {
    id: {
      field: 'id',
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      field: 'name',
      type: STRING(50),
      allowNull: false,
    },
    intro: {
      field: 'intro',
      type: TEXT,
      allowNull: true,
    },
    picture: {
      field: 'picture',
      type: BLOB,
      allowNull: true,
    },
    infoChain: {
      field: 'info_chain',
      type: JSON_TYPE,
      allowNull: false,
    },
  });

  return Book;
};
