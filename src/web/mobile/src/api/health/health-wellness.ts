/**
 * Health Wellness API — wellness resources and health goals functions.
 */

import { AxiosResponse } from 'axios';

import { getAuthSession } from '../care';
import { restClient } from '../client';

// ---------------------------------------------------------------------------
// Wellness Resource Interfaces
// ---------------------------------------------------------------------------

export interface WellnessArticle {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    imageUrl?: string;
    author: string;
    publishedAt: string;
    readTime: number;
}

export interface WellnessVideo {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    category: string;
}

export interface WellnessProgram {
    id: string;
    name: string;
    description: string;
    duration: string;
    modules: { name: string; completed: boolean }[];
    progress: number;
}

export interface WellnessBookmark {
    id: string;
    userId: string;
    resourceId: string;
    resourceType: 'article' | 'video' | 'program';
    createdAt: string;
}

// ---------------------------------------------------------------------------
// Health Goal Interfaces
// ---------------------------------------------------------------------------

export interface HealthGoal {
    id: string;
    userId: string;
    category: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline?: string;
    status: 'active' | 'completed' | 'paused';
}

export interface HealthGoalProgress {
    goalId: string;
    entries: { date: string; value: number }[];
    percentComplete: number;
    trend: 'improving' | 'stable' | 'declining';
}

// ---------------------------------------------------------------------------
// Helper: get auth headers or throw
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<{ Authorization: string }> {
    const session = await getAuthSession();
    if (!session) {
        throw new Error('Authentication required');
    }
    return { Authorization: `Bearer ${session.accessToken}` };
}

// ===========================================================================
// WELLNESS RESOURCES FUNCTIONS (8)
// ===========================================================================

export async function getWellnessArticles(category?: string, page?: number): Promise<WellnessArticle[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<WellnessArticle[]> = await restClient.get('/health/wellness/articles', {
        params: { category, page },
        headers,
    });
    return response.data;
}

export async function getWellnessArticleDetail(articleId: string): Promise<WellnessArticle> {
    const headers = await authHeaders();
    const response: AxiosResponse<WellnessArticle> = await restClient.get(`/health/wellness/articles/${articleId}`, {
        headers,
    });
    return response.data;
}

export async function getWellnessVideos(category?: string): Promise<WellnessVideo[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<WellnessVideo[]> = await restClient.get('/health/wellness/videos', {
        params: { category },
        headers,
    });
    return response.data;
}

export async function getWellnessPrograms(userId: string): Promise<WellnessProgram[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<WellnessProgram[]> = await restClient.get('/health/wellness/programs', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function getWellnessBookmarks(userId: string): Promise<WellnessBookmark[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<WellnessBookmark[]> = await restClient.get('/health/wellness/bookmarks', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function addWellnessBookmark(
    userId: string,
    resourceId: string,
    resourceType: WellnessBookmark['resourceType']
): Promise<WellnessBookmark> {
    const headers = await authHeaders();
    const response: AxiosResponse<WellnessBookmark> = await restClient.post(
        '/health/wellness/bookmarks',
        { userId, resourceId, resourceType },
        { headers }
    );
    return response.data;
}

export async function removeWellnessBookmark(bookmarkId: string): Promise<void> {
    const headers = await authHeaders();
    await restClient.delete(`/health/wellness/bookmarks/${bookmarkId}`, { headers });
}

export async function searchWellnessResources(
    query: string,
    type?: string
): Promise<(WellnessArticle | WellnessVideo)[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<(WellnessArticle | WellnessVideo)[]> = await restClient.get(
        '/health/wellness/search',
        { params: { query, type }, headers }
    );
    return response.data;
}

// ===========================================================================
// HEALTH GOALS FUNCTIONS (4)
// ===========================================================================

export async function getHealthGoals(userId: string): Promise<HealthGoal[]> {
    const headers = await authHeaders();
    const response: AxiosResponse<HealthGoal[]> = await restClient.get('/health/goals', {
        params: { userId },
        headers,
    });
    return response.data;
}

export async function createHealthGoal(
    userId: string,
    goal: Omit<HealthGoal, 'id' | 'userId' | 'current' | 'status'>
): Promise<HealthGoal> {
    const headers = await authHeaders();
    const response: AxiosResponse<HealthGoal> = await restClient.post(
        '/health/goals',
        { userId, ...goal },
        { headers }
    );
    return response.data;
}

export async function updateHealthGoal(goalId: string, updates: Partial<HealthGoal>): Promise<HealthGoal> {
    const headers = await authHeaders();
    const response: AxiosResponse<HealthGoal> = await restClient.put(`/health/goals/${goalId}`, updates, { headers });
    return response.data;
}

export async function getHealthGoalProgress(goalId: string): Promise<HealthGoalProgress> {
    const headers = await authHeaders();
    const response: AxiosResponse<HealthGoalProgress> = await restClient.get(`/health/goals/${goalId}/progress`, {
        headers,
    });
    return response.data;
}
