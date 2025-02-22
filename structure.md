casino-microservices/
├── package.json
├── shared/
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── game.types.ts
│   │   └── transaction.types.ts
│   ├── constants/
│   │   ├── error-codes.ts
│   │   └── game-types.ts
│   └── utils/
│       ├── logger.ts
│       └── validators.ts
│
├── services/
│   ├── gateway/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── gateway.module.ts
│   │   │   ├── controllers/
│   │   │   │   ├── game.controller.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── transaction.controller.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   └── logging.middleware.ts
│   │   │   └── config/
│   │   │       ├── routes.config.ts
│   │   │       └── cors.config.ts
│   │   └── package.json
│   │
│   ├── auth/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── kyc.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.service.ts
│   │   │   │   └── kyc.service.ts
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── user.entity.ts
│   │   │   │   └── repositories/
│   │   │   │       └── user.repository.ts
│   │   │   └── infrastructure/
│   │   │       └── persistence/
│   │   │           └── mongodb/
│   │   └── package.json
│   │
│   ├── game/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── game.module.ts
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── game.entity.ts
│   │   │   │   │   └── session.entity.ts
│   │   │   │   ├── events/
│   │   │   │   │   ├── game-started.event.ts
│   │   │   │   │   └── game-ended.event.ts
│   │   │   │   └── repositories/
│   │   │   │       └── game.repository.ts
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   │   ├── create-game.use-case.ts
│   │   │   │   │   └── end-game.use-case.ts
│   │   │   │   └── services/
│   │   │   │       ├── game.service.ts
│   │   │   │       └── rng.service.ts
│   │   │   └── infrastructure/
│   │   │       ├── persistence/
│   │   │       └── messaging/
│   │   └── package.json
│   │
│   ├── transaction/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── transaction.module.ts
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── transaction.entity.ts
│   │   │   │   │   └── wallet.entity.ts
│   │   │   │   ├── events/
│   │   │   │   │   ├── deposit.event.ts
│   │   │   │   │   └── withdrawal.event.ts
│   │   │   │   └── repositories/
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   └── services/
│   │   │   └── infrastructure/
│   │   │       ├── payment-providers/
│   │   │       └── persistence/
│   │   └── package.json
│   │
│   └── notification/
│       ├── src/
│       │   ├── main.ts
│       │   ├── notification.module.ts
│       │   ├── websocket/
│       │   │   ├── game.gateway.ts
│       │   │   └── chat.gateway.ts
│       │   ├── providers/
│       │   │   ├── email.provider.ts
│       │   │   ├── sms.provider.ts
│       │   │   └── push.provider.ts
│       │   └── templates/
│       │       ├── email/
│       │       └── push/
│       └── package.json
│
├── docker/
│   ├── development/
│   │   └── docker-compose.yml
│   └── production/
│       └── docker-compose.yml
│
├── k8s/
│   ├── gateway/
│   ├── auth/
│   ├── game/
│   └── transaction/
│
└── docs/
    ├── api/
    │   └── swagger/
    ├── architecture/
    └── deployment/
