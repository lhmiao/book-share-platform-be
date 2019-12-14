export default app => {
  const { INTEGER, STRING, BLOB, TEXT, JSON: JSON_TYPE } = app.Sequelize;

  const Book = app.model.define('book', {
    id: {
      field: 'id',
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookName: {
      field: 'book_name',
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
    recordChain: {
      field: 'record_chain',
      type: JSON_TYPE,
      allowNull: false,
      get() {
        const result = (this as any).getDataValue('recordChain');
        // update 的时候也会触发 get，为兼容没有更新的情况
        if (result) return result.recordChain;
        return result;
      },
      set(recordChain: object[]) {
        (this as any).setDataValue('recordChain', { recordChain });
      },
    },
    keeperId: {
      field: 'keeper_id',
      type: INTEGER,
      allowNull: false,
    },
    price: {
      field: 'price',
      type: INTEGER,
      allowNull: false,
    },
    onSell: {
      field: 'on_sell',
      type: INTEGER,
      allowNull: false,
      get() {
        const onSell = (this as any).getDataValue('onSell');
        // update 的时候也会触发 get，为兼容没有更新的情况
        if (onSell === undefined) return onSell;
        return !!onSell;
      },
      set(onSell: boolean) {
        (this as any).setDataValue('onSell', onSell ? 1 : 0);
      },
    },
  });

  Book.associate = () => {
    Book.belongsTo(app.model.User, {
      foreignKey: 'keeperId',
      targetKey: 'id',
      constraints: false,
      as: 'keeper',
    });
  };

  return Book;
};
