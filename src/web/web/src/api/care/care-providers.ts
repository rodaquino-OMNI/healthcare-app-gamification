/**
 * Care Providers API Module
 *
 * Handles provider/doctor search, profiles, reviews, availability,
 * favourites, and nearby provider lookups for the Care Now Journey.
 */

import { restClient } from '../client';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface DoctorProfile {
    id: string;
    name: string;
    specialty: string;
    bio: string;
    avatarUrl?: string;
    rating: number;
    reviewCount: number;
    languages: string[];
    education: string[];
    experience: string;
    acceptingNewPatients: boolean;
    insurancesAccepted: string[];
    location: { address: string; city: string; state: string };
}

export interface DoctorReview {
    id: string;
    doctorId: string;
    patientId: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface DoctorAvailability {
    doctorId: string;
    date: string;
    slots: Array<{ startTime: string; endTime: string; available: boolean }>;
}

export interface DoctorFilter {
    specialties: string[];
    insurances: string[];
    languages: string[];
    genders: string[];
    maxDistance?: number;
}

// ===========================================================================
// 1. DOCTOR / PROVIDER FUNCTIONS (9)
// ===========================================================================

/** Searches for healthcare providers based on criteria. */
export async function searchProviders(params: {
    specialty?: string;
    name?: string;
    location?: string;
    insurance?: string;
    language?: string;
}): Promise<DoctorProfile[]> {
    const response = await restClient.get<DoctorProfile[]>('/care/providers/search', { params });
    return response.data;
}

/** Retrieves a doctor's full profile. */
export async function getDoctorProfile(doctorId: string): Promise<DoctorProfile> {
    const response = await restClient.get<DoctorProfile>(`/care/doctors/${doctorId}`);
    return response.data;
}

/** Retrieves reviews for a doctor. */
export async function getDoctorReviews(doctorId: string, page?: number): Promise<DoctorReview[]> {
    const response = await restClient.get<DoctorReview[]>(`/care/doctors/${doctorId}/reviews`, {
        params: page !== undefined ? { page } : undefined,
    });
    return response.data;
}

/** Retrieves available time slots for a doctor on a given date. */
export async function getDoctorAvailability(doctorId: string, date: string): Promise<DoctorAvailability> {
    const response = await restClient.get<DoctorAvailability>(`/care/doctors/${doctorId}/availability`, {
        params: { date },
    });
    return response.data;
}

/** Retrieves available filter options for doctor search. */
export async function getDoctorFilters(): Promise<DoctorFilter> {
    const response = await restClient.get<DoctorFilter>('/care/doctors/filters');
    return response.data;
}

/** Saves a doctor as a favourite. */
export async function saveFavoriteDoctor(doctorId: string): Promise<void> {
    await restClient.post(`/care/doctors/${doctorId}/favorite`);
}

/** Removes a doctor from favourites. */
export async function removeFavoriteDoctor(doctorId: string): Promise<void> {
    await restClient.delete(`/care/doctors/${doctorId}/favorite`);
}

/** Retrieves saved/favourite doctors for a user. */
export async function getSavedDoctors(userId: string): Promise<DoctorProfile[]> {
    const response = await restClient.get<DoctorProfile[]>('/care/doctors/saved', { params: { userId } });
    return response.data;
}

/** Searches doctors with optional filters. */
export async function getDoctorSearchList(query: string, filters?: Partial<DoctorFilter>): Promise<DoctorProfile[]> {
    const response = await restClient.get<DoctorProfile[]>('/care/doctors/search', {
        params: { query, ...filters },
    });
    return response.data;
}

// ===========================================================================
// 2. ADDITIONAL PROVIDER FUNCTIONS (5)
// ===========================================================================

/** Submits a review for a doctor. */
export async function submitDoctorReview(
    doctorId: string,
    review: { rating: number; comment: string }
): Promise<DoctorReview> {
    const response = await restClient.post<DoctorReview>(`/care/doctors/${doctorId}/reviews`, review);
    return response.data;
}

/** Retrieves available provider specialties. */
export async function getProviderSpecialties(): Promise<string[]> {
    const response = await restClient.get<string[]>('/care/providers/specialties');
    return response.data;
}

/** Retrieves available provider insurance plans. */
export async function getProviderInsurances(): Promise<string[]> {
    const response = await restClient.get<string[]>('/care/providers/insurances');
    return response.data;
}

/** Retrieves nearby healthcare providers by coordinates. */
export async function getNearbyProviders(
    latitude: number,
    longitude: number,
    radius?: number
): Promise<DoctorProfile[]> {
    const response = await restClient.get<DoctorProfile[]>('/care/providers/nearby', {
        params: { latitude, longitude, ...(radius !== undefined ? { radius } : {}) },
    });
    return response.data;
}

/** Retrieves nearby urgent care locations with wait times. */
export async function getUrgentCareLocations(
    latitude: number,
    longitude: number
): Promise<Array<{ id: string; name: string; address: string; distance: string; phone: string; waitTime: number }>> {
    const response = await restClient.get<
        Array<{ id: string; name: string; address: string; distance: string; phone: string; waitTime: number }>
    >('/care/urgent-care', { params: { latitude, longitude } });
    return response.data;
}
