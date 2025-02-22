flowchart TD
    A[Registro de Usuario] --> B{Validación}
    B -->|Phone + Email| C[Generar Hash SHA-256]
    C --> D[(Almacenamiento Principal)]
    C --> E[(Registro Auditoría)]
    E --> F[Blockchain]
    D --> G[Encriptación AES-256]
    
    subgraph Inmutabilidad
        D -->|Triggers| H[Bloquear Updates]
        E -->|Solo Append| I[Almacenamiento WORM]
        F -->|Timestamp| J[Certificado Digital]
    end
    
    style D fill:#FFEB3B
    style E fill:#8BC34A
    style F stroke:#2196F3
