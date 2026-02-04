// Matches LoginRequest.java
export interface LoginRequest {
    email: string;
    password: string;
}

// Matches SignupRequest.java
export interface SignupRequest {
    email: string;
    password: string;
    displayName: string;
    inGameNickname: string;
}

// Matches ProfileUpdateRequest.java
export interface ProfileUpdateRequest {
    displayName: string;
    inGameNickname: string;
}

// Matches AvailabilityUpdateRequest.java and internal SlotDto
export interface SlotDto {
    dayOfWeek: number; // 0-6
    hourOfDay: number; // 0-23
    isAvailable: boolean;
}

export interface AvailabilityUpdateRequest {
    slots: SlotDto[];
}