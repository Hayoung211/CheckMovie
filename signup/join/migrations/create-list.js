'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('lists', {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      poster: {
        type: Sequelize.STRING,
      },
      title:{
        type: Sequelize.STRING,
      },
      heart :{
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('lists');
  }
};
