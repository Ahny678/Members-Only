const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
var bcrypt = require("bcryptjs");
const User = require("./user");

class Message extends Model {}

Message.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        isUUID: 4,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize,
    modelName: "Message",
  }
);

//one to many -> user -- messages
Message.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
    type: DataTypes.UUID,
  },
});

User.hasMany(Message, {
  foreignKey: "userId", // This must match exactly
});

module.exports = Message;
