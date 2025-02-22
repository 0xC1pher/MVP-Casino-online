Arquitectura de Base de Datos 
 Resumen 
 Ar esta 
 Arquitectura General 
 -Tipo  :  -Combinación  : Bases de datos SQL (Post  -Comunicación  : API REST, gRPC 
 Componentes 
 1.  Microservicio de Autenticación y Usuarios 
 Base de Datos - Base de datos  -Tablas  **- Base de 
users
user_id (PK) 
username (VARCHAR) 
email él 
password_hash ''password_hash 
role urrol 
user_profiles
profile_id ( 
user_id (FK) 
preferences (JSON) 
 2.  Microservicio de Juegos de 
 - Base de Datos  **- Base de  - Tablas (PostgreSQL) 
games
game_id ( 
name él 
category (ENUM) 
rpt ( 
game_stats 'juego 
game_id (FK) 
total_plays él 
total_payouts él 
 -Colecciones (MongoDB) 
game_logs
log_id (objetoId) 
user_id (String) 
game_id (String) 
actions (Array) 
 **  3.  Microservicio de Transacciones Financieras 
 Base de Datos - Base de datos  : PostgreSQL
 **  -Tablas 
transactions
transaction_id (PK) 
user_id (FK) 
amount (DECIMAL) 
status (ENUM) 
payment_methods
method_id (PK) 
user_id (FK) 
type (ENUM) 
 4.  Microservicio de Promociones y Bonificaciones 
 - Base de Datos  **- Base de Datos  -Tablas 
promotions
promotion_id él 
name él 
start_date ( 
end_date (DATE) 
bonuses
bonus_id él 
promotion_id (FK) 
user_id ''seluser_id 
amount (DECIMAL) 
 5.  Microservicio de Soporte y Chat 
 - Base de Datos  **- Base de  -Colecciones 
support_tickets
ticket_id él 
user_id él 
subject ( 
status (ENUM) 
chat_messages
message_id 'mensaje 
chat_id (String) 
sender (ENUM) 
message él 
 6.  Microservicio de Análisis y Reportes 
 - Base de Datos  **  -Formato 
 Documentos JSON para almacenar estadísticas y KPIs en tiempo 
 Alta Disponibilidad y Escalabilidad 
 Sharding en MongoDB  : Distribución de datos para manejar grandes vol 
 Replicación de PostgreSQL  **Replicación de 
 Kafka  : Cola de mensajes para sincronización 
 Seguridad 
 Encriptación  ** 
 Autenticación  : Tokens JWT y 
 Auditoría  : Registros en todas 
 Diagrama de Arquitectura 
 