flowchart LR
    APIG[API Gateway] -->|gRPC| AUTH[Autenticación]
    APIG -->|REST| GAMES[Juegos]
    APIG -->|HTTP/2| TRANS[Transacciones]
    
    AUTH -->|WebSocket| NOTIF[Notificaciones]
    TRANS -->|Kafka| AUDIT[Auditoría]
    GAMES -->|gRPC| ANALYTICS[Análisis]
    
    subgraph Seguridad
        AUDIT -->|TLS 1.3| ENCRYPT[Encriptació]
        ENCRYPT -->|AES-256-GCM| STORAGE[S3]
    end
