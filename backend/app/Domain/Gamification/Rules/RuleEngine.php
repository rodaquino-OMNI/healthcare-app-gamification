<?php

namespace App\Domain\Gamification\Rules;

use App\Domain\Gamification\Actions\AwardXpAction;
use App\Domain\Gamification\Actions\ProgressQuestAction;
use App\Domain\Gamification\Actions\UnlockAchievementAction;
use App\Models\GameProfile;
use App\Models\Rule;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class RuleEngine
{
    /**
     * Load all active gamification rules from the database/config.
     *
     * @return Collection<int, Rule>
     */
    public function loadRules(): Collection
    {
        return Cache::remember('gamification_rules', config('gamification.cache_ttl.rules', 600), function () {
            return Rule::all();
        });
    }

    /**
     * Process an incoming gamification event against all rules.
     */
    public function processEvent(array $event): void
    {
        $rules = $this->loadRules();
        $userId = $event['user_id'];
        $profile = GameProfile::firstOrCreate(
            ['user_id' => $userId],
            ['xp' => 0, 'level' => 1]
        );

        foreach ($rules as $rule) {
            if ($this->evaluateRule($rule, $event, $profile)) {
                foreach ($rule->actions as $action) {
                    $this->executeAction($action, $userId);
                }
            }
        }
    }

    /**
     * Evaluate a single rule against an event and user's game profile.
     */
    public function evaluateRule(Rule $rule, array $event, GameProfile $profile): bool
    {
        if ($rule->event !== $event['type']) {
            return false;
        }

        if (empty($rule->condition)) {
            return true;
        }

        $context = array_merge($event['payload'] ?? [], [
            'xp' => $profile->xp,
            'level' => $profile->level,
        ]);

        return $this->evaluateCondition(
            is_array($rule->condition) ? $rule->condition : ['expression' => $rule->condition],
            $context
        );
    }

    /**
     * Evaluate a single condition within a rule.
     */
    public function evaluateCondition(array $condition, array $context): bool
    {
        if (isset($condition['expression'])) {
            // Simple expression evaluation
            $expr = $condition['expression'];
            // Replace variable references with context values
            foreach ($context as $key => $value) {
                $expr = str_replace($key, (string) $value, $expr);
            }
            // Evaluate simple comparisons: "value >= threshold"
            if (preg_match('/^(\d+(?:\.\d+)?)\s*(>=|<=|>|<|==|!=)\s*(\d+(?:\.\d+)?)$/', trim($expr), $matches)) {
                $left = (float) $matches[1];
                $op = $matches[2];
                $right = (float) $matches[3];
                return match ($op) {
                    '>=' => $left >= $right,
                    '<=' => $left <= $right,
                    '>' => $left > $right,
                    '<' => $left < $right,
                    '==' => $left == $right,
                    '!=' => $left != $right,
                };
            }
            return false;
        }

        return false;
    }

    /**
     * Execute the action defined by a rule for the given user.
     */
    public function executeAction(array $action, string $userId): void
    {
        $type = $action['type'] ?? null;

        match ($type) {
            'AWARD_XP' => app(AwardXpAction::class)->execute($userId, $action['amount'] ?? 0, $action['reason'] ?? ''),
            'UNLOCK_ACHIEVEMENT' => app(UnlockAchievementAction::class)->execute($userId, $action['achievement_id'] ?? ''),
            'PROGRESS_QUEST' => app(ProgressQuestAction::class)->execute($userId, $action['quest_id'] ?? '', $action['task_id'] ?? ''),
            default => null,
        };
    }
}
