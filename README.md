# Estructura del Proyecto

Cada servicio:
- Es completamente independiente.
- Tiene su propio `package.json` y maneja sus propias dependencias.
- Se comunica a través de TCP.
- Puede ser desplegado de forma independiente.
- El API Gateway actúa como punto de entrada único y maneja el enrutamiento a los servicios correspondientes.
```
casino-microservices/
├── package.json
├── services/
│   ├── gateway/                 # API Gateway
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── gateway.module.ts
│   │   │   └── controllers/     # Controladores para rutear a microservicios
│   │   └── package.json
│   │
│   ├── game/                    # Servicio de Juegos
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── game.module.ts
│   │   │   ├── domain/          # Entidades y lógica de dominio (Blackjack, Bingo, Scratchcard, etc.)
│   │   │   ├── application/     # Casos de uso (p.ej., BlackjackPlayUseCase, BingoPlayUseCase)
│   │   │   └── infrastructure/  # Repositorios y servicios externos
│   │   └── package.json
│   │
│   ├── auth/                    # Servicio de Autenticación
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── auth.module.ts
│   │   │   └── strategies/      # Estrategias de autenticación
│   │   └── package.json
│   │
│   ├── notification/            # Servicio de Notificaciones
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── notification.module.ts
│   │   │   └── websocket/       # Implementación WebSocket para notificaciones en tiempo real
│   │   └── package.json
│   │
│   └── transaction/             # Servicio de Transacciones
│       ├── src/
│       │   ├── main.ts
│       │   ├── transaction.module.ts
│       │   └── domain/        # Lógica de transacciones (balance, apuestas/ganancias, etc.)
│       └── package.json
│
└── supabase/
    └── migrations/            # Migraciones de base de datos
```

# Changelog

## [1.2.0] - 2025-02-09
### Added
- **Separación clara de los módulos en servicios independientes**:
  - **Game Service (Puerto 3001)**: Contiene la lógica de juegos como Blackjack, Bingo y Scratchcard.
  - **Auth Service (Puerto 3002)**: Gestiona la autenticación y autorización de usuarios.
  - **Notification Service (Puerto 3003)**: Proporciona notificaciones en tiempo real a través de WebSocket.
  - **Transaction Service (Puerto 3004)**: Maneja transacciones financieras, balances de usuarios y apuestas/ganancias.
- **Configuración de comunicación entre microservicios usando TCP**:  
  - Cada servicio se comunica con otros servicios a través de TCP utilizando patrones como CQRS.
- **Características por servicio**:
  - Conexión a base de datos propia cuando es necesario.
  - Dependencias y módulos principales propios.
- **API Gateway como punto de entrada único**:
  - Actúa como intermediario para todas las solicitudes externas.

### Changed
- **Comunicación entre servicios**:
  - Migración completa a una arquitectura basada en mensajes TCP/HTTP para mejorar la escalabilidad y modularidad.
  
### To Do
- **Implementar controladores para cada servicio**:
  - Completar los controladores específicos para cada microservicio.
- **Configurar comunicación usando patrones CQRS**:
  - Implementar patrones avanzados de comunicación entre microservicios.
- **Implementar manejo de transacciones distribuidas**:
  - Asegurar la consistencia de datos entre múltiples servicios.
- **Configurar el servicio de autenticación**:
  - Finalizar detalles de autenticación y autorización.
- **Implementar el servicio de notificaciones**:
  - Mejorar la funcionalidad de notificaciones en tiempo real.
- **Refinar la lógica del servicio de transacciones**:
  - Asegurar operaciones atómicas y consistencia en las transacciones financieras.

## [1.1.0] - 2025-02-05
### Added
- **Arquitectura de Microservicios**:  
  - **Game Service**: Lógica de juegos (Blackjack, Bingo, Scratchcard), casos de uso (BlackjackPlayUseCase, BingoPlayUseCase) y entidades de juego.
  - **Transaction Service**: Gestión de balance de usuarios, apuestas/ganancias y lógica de GameParticipant.
  - **Auth Service**: Autenticación, autorización y manejo de entidad User.
  - **Notification Service**: Implementación de WebSocket (WebsocketNotificationService) para notificaciones en tiempo real.

### Changed
- **Comunicación entre servicios**:  
  - Migración de llamadas directas a mensajes TCP/HTTP usando NestJS Microservices.

## [1.0.3] - 2025-01-30
### Fixed
- **Discrepancias de tipado**:  
  - Corrección entre entidades TypeORM y DTOs de dominio.
- **Integración WebSocket**:  
  - Conexión completa entre NotificationService y WebSocketGateway.

### Added
- **Transacciones complejas**:  
  - Implementación del patrón Unit of Work para operaciones complejas en Blackjack.

## [1.0.2] - 2025-01-27
### Fixed
- **WebSocket JWT Guard**:  
  - Creación de `ws-jwt.guard.ts` para la autenticación en tiempo real.
- **Relaciones TypeORM**:  
  - Ajustes en las relaciones entre Game, GameParticipant y User.

### Changed
- **Actualización atómica de balances**:  
  - Uso de operaciones atómicas en PostgreSQL para `updateUserBalance`.

## [1.0.1] - 2025-01-25
### Fixed
- **Errores de módulos**:  
  - Corrección en la exportación de NotificationService (TS2306).
- **Redeclaración de módulo**:  
  - Eliminación de exportaciones redundantes en GameModule (TS2323/TS2484).
- **Implementación de repositorio**:  
  - Inclusión de métodos faltantes en PostgresGameRepository (TS2420).

## [1.0.0] - 2025-01-20
### Known Issues
- Errores de compilación por módulos no configurados.
- Repositorio PostgreSQL incompleto.
- Falta de guardia para WebSocket.
- Relaciones entre entidades aún no funcionales.
