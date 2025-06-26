'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      todo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      due_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      status: {
        allowNull: false,
        defaultValue: "pending",
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        defaultValue: "uncategorized",
        type: Sequelize.STRING
      },
      UserId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users"
          },
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Todos');
  }
};