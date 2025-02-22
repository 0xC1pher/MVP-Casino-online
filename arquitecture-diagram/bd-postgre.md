classDiagram
    class users {
        +user_id: uuid PK
        +username: varchar(50) UNIQUE IMMUTABLE
        +email: varchar(120) UNIQUE IMMUTABLE
        +phone_number: varchar(15) UNIQUE IMMUTABLE
        +password_hash: char(60)
        +role: enum('user','admin')
        +created_at: timestamp
    }
    
    class game_stats {
        +game_id: uuid PK
        +total_plays: bigint
        +total_payouts: decimal(18,2)
        +volatility_index: float
    }
    
    users "1"--"*" transactions : has
