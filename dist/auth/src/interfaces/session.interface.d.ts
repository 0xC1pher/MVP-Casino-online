export interface SessionMetadata {
    ip: string;
    userAgent: string;
    location?: string;
    deviceId?: string;
}
export interface ActivityLog {
    userId: string;
    timestamp: Date;
    ip: string;
    userAgent: string;
    path: string;
    method: string;
    query: any;
    body: any;
}
