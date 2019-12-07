export default app => {
  const { INTEGER, STRING, BLOB } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      field: 'id',
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      field: 'username',
      type: STRING(50),
      unique: true,
      allowNull: false,
    },
    password: {
      field: 'password',
      type: STRING(50),
      allowNull: false,
    },
    securityQuestion: {
      field: 'security_question',
      type: STRING(50),
      allowNull: false,
    },
    securityAnswer: {
      field: 'security_answer',
      type: STRING(50),
      allowNull: false,
    },
    phone: {
      field: 'phone',
      type: STRING(11),
      allowNull: true,
    },
    qq: {
      field: 'qq',
      type: STRING(20),
      allowNull: true,
    },
    wechat: {
      field: 'wechat',
      type: STRING(20),
      allowNull: true,
    },
    coinNumber: {
      field: 'coin_number',
      type: STRING(20),
      allowNull: true,
    },
    avatar: {
      field: 'avatar',
      type: BLOB,
      allowNull: true,
    },
  });

  return User;
};
