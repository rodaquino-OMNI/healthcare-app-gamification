/**
 * Type declarations for the PreferencesService and related classes
 */

export interface UserPreference {
    id: string;
    userId: string;
    channels: string[];
    pushEnabled: boolean;
    emailEnabled: boolean;
    smsEnabled: boolean;
    inAppEnabled: boolean;
    journeyPreferences: Record<string, JourneyPreference>;
    createdAt: Date;
    updatedAt: Date;
}

export interface JourneyPreference {
    enabled: boolean;
    channels: string[];
}

export interface PreferencesService {
    findOneByUserId(userId: string): Promise<UserPreference>;
    findAll(): Promise<UserPreference[]>;
    findOne(id: string): Promise<UserPreference>;
    create(createPreferenceDto: unknown): Promise<UserPreference>;
    update(id: string, updatePreferenceDto: unknown): Promise<UserPreference>;
    remove(id: string): Promise<boolean>;
}
