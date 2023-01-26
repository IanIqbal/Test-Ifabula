'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Item)
      Transaction.belongsTo(models.Company)

    }
  }
  Transaction.init({
    companyName: DataTypes.STRING,
    itemName: DataTypes.STRING,
    totalItem: DataTypes.INTEGER,
    itemPrice:DataTypes.INTEGER,
    grandTotal:DataTypes.INTEGER,
    stockReserve:DataTypes.INTEGER,
    CompanyId: DataTypes.INTEGER,
    ItemId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};