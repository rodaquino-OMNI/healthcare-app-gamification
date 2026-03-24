/**
 * Safe condition evaluator for gamification rules.
 *
 * Replaces expr-eval (CVE: prototype pollution + unrestricted function execution)
 * with a hardcoded condition map. Every allowed condition is explicit, type-safe,
 * and auditable. Unknown conditions fail closed (return false).
 */

interface RuleContext {
    event: {
        type: string;
        data: Record<string, unknown>;
        metadata: Record<string, unknown>;
        journey: string;
        timestamp: Date;
    };
    user: {
        id: string;
        profile: Record<string, unknown>;
        level: number;
        xp: number;
    };
}

type ConditionFn = (ctx: RuleContext) => boolean;

/**
 * Registry of all allowed rule conditions.
 * Each key is the exact condition string from the rule definition.
 * Each value is a pure function that evaluates the condition safely.
 *
 * To add a new condition: add a new entry here. No other code changes needed.
 */
const CONDITIONS: Record<string, ConditionFn> = {
    // Always-true conditions (unconditional triggers)
    true: () => true,

    // Health journey conditions
    'event.data.steps >= 10000': (ctx) => {
        const steps = Number(ctx.event.data?.steps ?? 0);
        return Number.isFinite(steps) && steps >= 10000;
    },

    // Plan journey conditions
    'event.data.docCount >= 3': (ctx) => {
        const docCount = Number(ctx.event.data?.docCount ?? 0);
        return Number.isFinite(docCount) && docCount >= 3;
    },
};

/**
 * Evaluate a rule condition string against a context object.
 *
 * @param condition - The condition string (must match a key in CONDITIONS)
 * @param context - The evaluation context with event and user data
 * @returns true if condition is satisfied, false otherwise (fail-closed)
 */
export function evaluateCondition(condition: string, context: RuleContext): boolean {
    const fn = CONDITIONS[condition];
    if (!fn) {
        // Fail closed: unknown conditions are denied
        return false;
    }
    try {
        return fn(context);
    } catch {
        // Fail closed: evaluation errors are denied
        return false;
    }
}

/**
 * Check whether a condition string is registered (for validation/logging).
 */
export function isKnownCondition(condition: string): boolean {
    return condition in CONDITIONS;
}
