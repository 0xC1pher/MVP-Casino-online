classDiagram
    class game_logs {
        +_id: ObjectId
        +user_id: string
        +game_id: string
        +actions: Array<BSON::Binary>
        +timestamps: [ISODate]
    }
    
    class audit_logs {
        +_id: ObjectId
        +event_hash: BinData(5,SHA-256)
        +previous_hash: BinData(5,SHA-256)
        +timestamp: Timestamp
    }
