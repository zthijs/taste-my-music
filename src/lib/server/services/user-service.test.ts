import { describe, it, expect, beforeEach, vi } from 'vitest';
import { deleteUserAccount } from './user-service';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

vi.mock('$lib/server/db', () => ({
    db: {
        delete: vi.fn(() => ({
            where: vi.fn()
        }))
    }
}));

describe('user-service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('deleteUserAccount', () => {
        it('should throw error if userId is not provided', async () => {
            await expect(deleteUserAccount('')).rejects.toThrow('User ID is required');
        });

        it('should delete all user-related data in correct order', async () => {
            const userId = 'test-user-id';
            const mockWhere = vi.fn();
            const mockDelete = vi.fn(() => ({ where: mockWhere }));

            (db.delete as any) = mockDelete;

            await deleteUserAccount(userId);

            expect(mockDelete).toHaveBeenCalledTimes(6);
            expect(mockDelete).toHaveBeenCalledWith(schema.artistRecommendations);
            expect(mockDelete).toHaveBeenCalledWith(schema.listeningData);
            expect(mockDelete).toHaveBeenCalledWith(schema.musicProfiles);
            expect(mockDelete).toHaveBeenCalledWith(schema.sessions);
            expect(mockDelete).toHaveBeenCalledWith(schema.accounts);
            expect(mockDelete).toHaveBeenCalledWith(schema.users);
        });

        it('should handle database errors gracefully', async () => {
            const userId = 'test-user-id';
            const mockError = new Error('Database error');

            (db.delete as any) = vi.fn(() => ({
                where: vi.fn().mockRejectedValue(mockError)
            }));

            await expect(deleteUserAccount(userId)).rejects.toThrow(
                'Failed to delete user account. Please try again.'
            );
        });
    });
});
