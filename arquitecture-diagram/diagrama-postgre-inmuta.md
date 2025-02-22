flowchart LR
    subgraph PostgreSQL
        A[Trigger] -->|Impedir UPDATE| B[Campos Críticos]
        C[CHECK Constraints] -->|Validar formato| D[phone_number]
    end
    
    subgraph Auditoría
        E[Registro] --> F[Hash SHA-256]
        F --> G[Blockchain Privada]
        G --> H[Certificado Inmutable]
    end
    
    subgraph Aplicación
        I[API] -->|Firmar Digitalmente| J[Payload]
        J -->|HMAC-SHA256| K[Headers]
    end
