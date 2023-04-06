"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `import {
\tDurinnRestrictedModelBaseInterface,
\tModelInterface,
\tOrderInterface,
\tTeamInterface,
\tUserInterface
} from "../../../../../src/interfaces";

export interface OrderUserTeamInterface extends DurinnRestrictedModelBaseInterface {
\torderId: number;
\tOrder ?: OrderInterface;
\t
\tuserId: number;
\tUser ?: UserInterface;
\tuserAs: string;
\t
\tteamId: number;
\tTeam ?: TeamInterface;
}
`;
