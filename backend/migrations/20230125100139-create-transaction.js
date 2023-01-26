'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName: {
        type: Sequelize.STRING
      },
      itemName: {
        type: Sequelize.STRING
      },
      totalItem: {
        type: Sequelize.INTEGER
      },
      itemPrice:{
        type: Sequelize.INTEGER
      },
      grandTotal:{
        type: Sequelize.INTEGER
      },
      stockReserve:{
        type: Sequelize.INTEGER

      },
      CompanyId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Companies",
          key:"id"
        }
      },
      ItemId: {
        type: Sequelize.INTEGER,
        references:{
          model:"Items",
          key:"id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};