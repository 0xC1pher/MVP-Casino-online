erDiagram
    USERS ||--o{ USER_PROFILES : "1 a muchos"
    USERS ||--o{ TRANSACTIONS : "1 a muchos"
    USERS ||--o{ PAYMENT_METHODS : "1 a muchos"
    GAMES ||--o{ GAME_STATS : "1 a 1"
    GAMES ||--o{ GAME_LOGS : "1 a muchos"
    PROMOTIONS ||--o{ BONUSES : "1 a muchos"

    USERS {
        uuid user_id PK "UUID v4"
        varchar(50) username UNIQUE IMMUTABLE
        varchar(120) email UNIQUE IMMUTABLE
        varchar(15) phone_number UNIQUE IMMUTABLE
        char(60) password_hash "Bcrypt"
        enum('user','admin') role
        timestamp created_at "DEFAULT NOW()"
    }
    
    USER_PROFILES {
        uuid profile_id PK
        uuid user_id FK
        json preferences
        timestamp last_updated
    }
    
    TRANSACTIONS {
        uuid transaction_id PK
        uuid user_id FK
        decimal(12,2) amount
        enum('pending','completed','failed') status
        timestamp processed_at "DEFAULT NOW()"
    }
