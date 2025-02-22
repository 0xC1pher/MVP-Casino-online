"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const microservices_1 = require("@nestjs/microservices");
const game_entity_1 = require("./domain/entities/game.entity");
const user_entity_1 = require("./domain/entities/user.entity");
const game_participant_entity_1 = require("./domain/entities/game-participant.entity");
const blackjack_entity_1 = require("./domain/entities/blackjack.entity");
const bingo_entity_1 = require("./domain/entities/bingo.entity");
const scratchcard_entity_1 = require("./domain/entities/scratchcard.entity");
const postgres_game_repository_1 = require("./infrastructure/repositories/postgres-game.repository");
const create_game_use_case_1 = require("./application/use-cases/create-game.use-case");
const join_game_use_case_1 = require("./application/use-cases/join-game.use-case");
const start_game_use_case_1 = require("./application/use-cases/start-game.use-case");
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                game_entity_1.Game,
                user_entity_1.User,
                game_participant_entity_1.GameParticipant,
                blackjack_entity_1.BlackjackGame,
                bingo_entity_1.BingoGame,
                scratchcard_entity_1.ScratchcardGame,
            ]),
            microservices_1.ClientsModule.register([
                {
                    name: 'NOTIFICATION_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
                        port: parseInt(process.env.NOTIFICATION_SERVICE_PORT) || 3003
                    }
                },
                {
                    name: 'TRANSACTION_SERVICE',
                    transport: microservices_1.Transport.TCP,
                    options: {
                        host: process.env.TRANSACTION_SERVICE_HOST || 'localhost',
                        port: parseInt(process.env.TRANSACTION_SERVICE_PORT) || 3004
                    }
                }
            ])
        ],
        providers: [
            {
                provide: 'GameRepository',
                useClass: postgres_game_repository_1.PostgresGameRepository,
            },
            create_game_use_case_1.CreateGameUseCase,
            join_game_use_case_1.JoinGameUseCase,
            start_game_use_case_1.StartGameUseCase,
        ],
        exports: [
            create_game_use_case_1.CreateGameUseCase,
            join_game_use_case_1.JoinGameUseCase,
            start_game_use_case_1.StartGameUseCase,
        ],
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map