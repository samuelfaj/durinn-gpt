export default `import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import {Order, Team, User} from '@models';
import {OrderUserTeamInterface} from "@feline/v.1/backend/interfaces/models/OrderUserTeam.interface";
import DurinnRestrictedModelBase from "@durinn/v.3/backend/models/bases/DurinnRestrictedModel.base";

@Table
export default class OrderUserTeam extends DurinnRestrictedModelBase implements OrderUserTeamInterface {
\t@Column userAs: string;
\t
\t@ForeignKey(() => Order) @Column orderId: number;
\t@BelongsTo(() => Order) Order: Order;
\t
\t@ForeignKey(() => User) @Column userId: number;
\t@BelongsTo(() => User) User: User;
\t
\t@ForeignKey(() => Team) @Column teamId: number;
\t@BelongsTo(() => Team) Team: Team;
}`;
