import { AuthResolvers } from './auth.resolvers';
import { CareResolvers } from './care.resolvers';
import { GamificationResolvers } from './gamification.resolvers';
import { HealthResolvers } from './health.resolvers';
import { PlanResolvers } from './plan.resolvers';
import { resolvers } from './resolvers';

describe('resolvers aggregator', () => {
    it('should export exactly 5 resolver classes', () => {
        expect(resolvers).toHaveLength(5);
    });

    it('should include all resolver classes', () => {
        expect(resolvers).toContain(AuthResolvers);
        expect(resolvers).toContain(HealthResolvers);
        expect(resolvers).toContain(CareResolvers);
        expect(resolvers).toContain(PlanResolvers);
        expect(resolvers).toContain(GamificationResolvers);
    });
});
