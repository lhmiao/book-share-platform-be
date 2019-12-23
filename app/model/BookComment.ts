import moment from 'moment';

export default app => {
  const { INTEGER, TEXT, DATE, JSON: JSON_TYPE } = app.Sequelize;

  const BookComment = app.model.define('book_comment', {
    id: {
      field: 'id',
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      field: 'content',
      type: TEXT,
      allowNull: false,
    },
    createdAt: {
      field: 'created_at',
      type: DATE,
      allowNull: false,
      get() {
        const createdAt = (this as any).getDataValue('createdAt');
        if (createdAt) return moment(createdAt).format('YYYY-MM-DD hh:mm:ss');
        return createdAt;
      },
    },
    updatedAt: {
      field: 'updated_at',
      type: DATE,
      allowNull: true,
      get() {
        const updatedAt = (this as any).getDataValue('updatedAt');
        if (updatedAt) return moment(updatedAt).format('YYYY-MM-DD hh:mm:ss');
        return updatedAt;
      },
    },
    userId: {
      field: 'user_id',
      type: INTEGER,
      allowNull: false,
    },
    bookId: {
      field: 'book_id',
      type: INTEGER,
      allowNull: false,
    },
    likeUserIdList: {
      field: 'like_user_id_list',
      type: JSON_TYPE,
      allowNull: false,
      get() {
        const result = (this as any).getDataValue('likeUserIdList');
        // update 的时候也会触发 get，为兼容没有更新的情况
        if (result) return result.userIds;
        return result;
      },
      set(userIds) {
        (this as any).setDataValue('likeUserIdList', { userIds });
      },
    },
    dislikeUserIdList: {
      field: 'dislike_user_id_list',
      type: JSON_TYPE,
      allowNull: false,
      get() {
        const result = (this as any).getDataValue('dislikeUserIdList');
        // update 的时候也会触发 get，为兼容没有更新的情况
        if (result) return result.userIds;
        return result;
      },
      set(userIds) {
        (this as any).setDataValue('dislikeUserIdList', { userIds });
      },
    },
  });

  BookComment.associate = () => {
    BookComment.belongsTo(app.model.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      constraints: false,
      as: 'commentUser',
    });
  };

  return BookComment;
};
