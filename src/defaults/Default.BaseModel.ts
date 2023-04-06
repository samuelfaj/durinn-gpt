export default `import {
\tBeforeCreate, BeforeDestroy,
\tBeforeFind,
\tBeforeUpdate,
\tBelongsTo,
\tColumn,
\tForeignKey,
\tModel,
\tTable,
} from 'sequelize-typescript';
import {Op} from 'sequelize';
import {Enterprise, User} from '@models';
import DurinnModelBase from './DurinnModel.base';
import HistoryModel from "./HistoryModel.base";

@Table
export default class DurinnRestrictedModelBase<T = any, T2 = any> extends HistoryModel<T, T2> {
\t@ForeignKey(() => Enterprise) @Column enterpriseId: number;
\t@BelongsTo(() => Enterprise, {foreignKey: 'enterpriseId', targetKey: 'id'}) Enterprise?: Enterprise;

\t@ForeignKey(() => User) @Column createdBy ?: number;
\t@BelongsTo(() => User, {foreignKey: 'createdBy', targetKey: 'id'}) CreatedBy ?: User;

\t@ForeignKey(() => User) @Column updatedBy ?: number;
\t@BelongsTo(() => User, {foreignKey: 'updatedBy', targetKey: 'id'}) UpdatedBy ?: User;

\t@ForeignKey(() => User) @Column deletedBy ?: number;
\t@BelongsTo(() => User, {foreignKey: 'deletedBy', targetKey: 'id'}) DeletedBy ?: User;

\t@BeforeFind
\tstatic async restrictEnterprise(options) {
\t\tconst user = DurinnModelBase.optionsHelper(options).user;

\t\tif (user) {
\t\t\toptions.where = {
\t\t\t\t[Op.and]: [options.where, {enterpriseId: user.enterpriseId}],
\t\t\t};
\t\t}
\t}

\t@BeforeCreate
\t@BeforeUpdate
\tstatic setEnterprise(instance: DurinnRestrictedModelBase, options) {
\t\tconst user = DurinnModelBase.optionsHelper(options).user;

\t\tif (user) {
\t\t\tinstance.enterpriseId = user.enterpriseId;
\t\t}
\t}

\t@BeforeCreate
\tstatic setCreator(instance: DurinnRestrictedModelBase, options) {
\t\tconst user = DurinnModelBase.optionsHelper(options).user;

\t\tif (user && !instance.createdBy) {
\t\t\tinstance.createdBy = user.id || null;
\t\t}
\t}

\t@BeforeUpdate
\tstatic setUpdator(instance: DurinnRestrictedModelBase, options) {
\t\tconst user = DurinnModelBase.optionsHelper(options).user;

\t\tif (user) {
\t\t\tinstance.updatedBy = user.id || null;
\t\t}
\t}

\t@BeforeDestroy
\tstatic setDeleter(instance: DurinnRestrictedModelBase, options) {
\t\tconst user = DurinnModelBase.optionsHelper(options).user;

\t\tif (user) {
\t\t\tinstance.deletedBy = user.id || null;
\t\t}
\t}
}`;
