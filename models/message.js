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
User.hasMany(Message, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

Message.belongsTo(User);

module.exports = User;
