sequenceDiagram
    participant U as Usuario
    participant A as API Gateway
    participant V as Validador
    participant B as Base de Datos
    participant S as Auditoría
    
    U->>A: POST /register (phone, email, password)
    A->>V: Validar formato teléfono (E.164)
    V-->>A: OK/Error
    alt Validación Exitosa
        A->>B: INSERT users (campos inmutables)
        B->>S: Generar registro auditoría
        S->>S: Calcular hash SHA-256
        S->>B: Confirmación
        B-->>A: 201 Created
        A-->>U: JWT + Certificado digital
    else Error Validación
        A-->>U: 400 Bad Request
    end
