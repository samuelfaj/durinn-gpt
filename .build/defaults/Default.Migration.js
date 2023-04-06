"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
'use strict';

module.exports = {
\tup: (queryInterface, Sequelize) => {
\t\treturn queryInterface.createTable('OrderUserTeam', {
\t\t\tid: {
\t\t\t\tallowNull: false,
\t\t\t\tprimaryKey: true,
\t\t\t\tautoIncrement: true,
\t\t\t\ttype: Sequelize.INTEGER(),
\t\t\t},
\t\t\tcreatedBy: {
\t\t\t\tallowNull: true,
\t\t\t\tonDelete: 'set null',
\t\t\t\tonUpdate: 'set null',
\t\t\t\ttype: Sequelize.INTEGER,
\t\t\t\treferences: { model: 'User', key: 'id' },
\t\t\t},
\t\t\tcreatedAt: {
\t\t\t\tallowNull: true,
\t\t\t\ttype: Sequelize.DATE,
\t\t\t\tdefaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
\t\t\t},
\t\t\tupdatedBy: {
\t\t\t\tallowNull: true,
\t\t\t\tonDelete: 'set null',
\t\t\t\tonUpdate: 'set null',
\t\t\t\ttype: Sequelize.INTEGER,
\t\t\t\treferences: { model: 'User', key: 'id' },
\t\t\t},
\t\t\tupdatedAt: {
\t\t\t\tallowNull: true,
\t\t\t\ttype: Sequelize.DATE,
\t\t\t},
\t\t\tdeletedBy: {
\t\t\t\tallowNull: true,
\t\t\t\tonDelete: 'set null',
\t\t\t\tonUpdate: 'set null',
\t\t\t\ttype: Sequelize.INTEGER,
\t\t\t\treferences: { model: 'User', key: 'id' },
\t\t\t},
\t\t\tdeletedAt: {
\t\t\t\tallowNull: true,
\t\t\t\ttype: Sequelize.DATE,
\t\t\t},
\t\t\tenterpriseId: {
\t\t\t\tallowNull: false,
\t\t\t\tonDelete: 'cascade',
\t\t\t\tonUpdate: 'cascade',
\t\t\t\ttype: Sequelize.INTEGER,
\t\t\t\treferences: { model: 'Enterprise', key: 'id' },
\t\t\t},
\t\t\torderId: {
\t\t\t\tallowNull: false,
\t\t\t\tonDelete: 'cascade',
\t\t\t\tonUpdate: 'cascade',
\t\t\t\ttype: Sequelize.INTEGER,
\t\t\t\treferences: { model: 'Order', key: 'id' },
\t\t\t},
\t\t\tuserId: {
\t\t\t\tallowNull: false,
\t\t\t\tonDelete: 'cascade',
\t\t\t\tonUpdate: 'cascade',
\t\t\t\ttype: Sequelize.INTEGER,
\t\t\t\treferences: { model: 'User', key: 'id' },
\t\t\t},
\t\t\tuserAs: {
\t\t\t\tallowNull: false,
\t\t\t\ttype: Sequelize.STRING,
\t\t\t\tdefaultValue: 'seller'
\t\t\t},
\t\t\tteamId: {
\t\t\t\tallowNull: false,
\t\t\t\tonDelete: 'cascade',
\t\t\t\tonUpdate: 'cascade',
\t\t\t\ttype: Sequelize.INTEGER,
\t\t\t\treferences: { model: 'Team', key: 'id' },
\t\t\t\tcomment: 'Equipe em que o usuario estava quando foi atribuido ao pedido'
\t\t\t}
\t\t});
\t},
\tdown: (queryInterface, Sequelize) => {
\t\treturn queryInterface.dropTable('OrderUserTeam');
\t}
};`;
