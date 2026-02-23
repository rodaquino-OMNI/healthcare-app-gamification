import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import type { Theme } from '../../../../design-system/src/themes/base.theme';
import { colors } from '../../../../design-system/src/tokens/colors';
import { spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadiusValues } from '../../../../design-system/src/tokens/borderRadius';
import type { WellnessNavigationProp } from '../../navigation/types';

/**
 * Breathing phase types.
 */
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'idle';

/**
 * Duration option in minutes.
 */
interface DurationOption {
  minutes: number;
  labelKey: string;
}

/**
 * Phase configuration with duration in milliseconds.
 */
interface PhaseConfig {
  phase: BreathingPhase;
  duration: number;
  labelKey: string;
}

const DURATION_OPTIONS: DurationOption[] = [
  { minutes: 3, labelKey: 'journeys.health.wellness.breathing.duration3' },
  { minutes: 5, labelKey: 'journeys.health.wellness.breathing.duration5' },
  { minutes: 10, labelKey: 'journeys.health.wellness.breathing.duration10' },
];

const BREATHING_CYCLE: PhaseConfig[] = [
  { phase: 'inhale', duration: 4000, labelKey: 'journeys.health.wellness.breathing.breatheIn' },
  { phase: 'hold', duration: 4000, labelKey: 'journeys.health.wellness.breathing.hold' },
  { phase: 'exhale', duration: 6000, labelKey: 'journeys.health.wellness.breathing.breatheOut' },
];

/**
 * CompanionBreathingScreen provides a guided breathing exercise
 * with animated visual cues and configurable duration.
 */
export const CompanionBreathingScreen: React.FC = () => {
  const navigation = useNavigation<WellnessNavigationProp>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);

  const [selectedDuration, setSelectedDuration] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('idle');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSeconds = selectedDuration * 60;

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    timerRef.current = null;
    phaseTimerRef.current = null;
  }, []);

  const runPhase = useCallback(
    (index: number) => {
      const config = BREATHING_CYCLE[index % BREATHING_CYCLE.length];
      setCurrentPhase(config.phase);
      setPhaseIndex(index);

      // Animate circle based on phase
      if (config.phase === 'inhale') {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: config.duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: config.duration,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (config.phase === 'exhale') {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: config.duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: config.duration,
            useNativeDriver: true,
          }),
        ]).start();
      }
      // 'hold' keeps current scale/opacity

      phaseTimerRef.current = setTimeout(() => {
        const nextIndex = index + 1;
        if (nextIndex % BREATHING_CYCLE.length === 0) {
          setCycleCount((prev) => prev + 1);
        }
        runPhase(nextIndex);
      }, config.duration);
    },
    [scaleAnim, opacityAnim],
  );

  const handleStart = useCallback(() => {
    setIsActive(true);
    setElapsedSeconds(0);
    setCycleCount(0);
    setPhaseIndex(0);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev + 1 >= totalSeconds) {
          clearTimers();
          setIsActive(false);
          setCurrentPhase('idle');
          scaleAnim.setValue(1);
          opacityAnim.setValue(0.6);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    runPhase(0);
  }, [totalSeconds, runPhase, clearTimers, scaleAnim, opacityAnim]);

  const handlePause = useCallback(() => {
    clearTimers();
    setIsActive(false);
    setCurrentPhase('idle');
    scaleAnim.setValue(1);
    opacityAnim.setValue(0.6);
  }, [clearTimers, scaleAnim, opacityAnim]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseLabel = (): string => {
    if (currentPhase === 'idle') {
      return t('journeys.health.wellness.breathing.ready');
    }
    const config = BREATHING_CYCLE[phaseIndex % BREATHING_CYCLE.length];
    return t(config.labelKey);
  };

  return (
    <SafeAreaView style={styles.container} testID="wellness-breathing-screen">
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t('common.buttons.back')}
        >
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {t('journeys.health.wellness.breathing.screenTitle')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Animated breathing circle */}
        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
            testID="breathing-circle"
          >
            <Animated.View style={styles.innerCircle}>
              <Text style={styles.phaseText}>{getPhaseLabel()}</Text>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Timer display */}
        <Text style={styles.timerText} testID="breathing-timer">
          {formatTime(isActive ? totalSeconds - elapsedSeconds : totalSeconds)}
        </Text>

        {/* Cycle counter */}
        <Text style={styles.cycleText}>
          {t('journeys.health.wellness.breathing.cycles', { count: cycleCount })}
        </Text>

        {/* Duration selector */}
        {!isActive && (
          <View style={styles.durationRow}>
            {DURATION_OPTIONS.map((option) => {
              const isSelected = selectedDuration === option.minutes;
              return (
                <TouchableOpacity
                  key={option.minutes}
                  style={[styles.durationChip, isSelected && styles.durationChipSelected]}
                  onPress={() => setSelectedDuration(option.minutes)}
                  accessibilityLabel={t(option.labelKey)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  testID={`duration-${option.minutes}`}
                >
                  <Text
                    style={[
                      styles.durationText,
                      isSelected && styles.durationTextSelected,
                    ]}
                  >
                    {t(option.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Start/Pause button */}
        <TouchableOpacity
          style={[styles.actionButton, isActive && styles.actionButtonPause]}
          onPress={isActive ? handlePause : handleStart}
          accessibilityLabel={
            isActive
              ? t('journeys.health.wellness.breathing.pause')
              : t('journeys.health.wellness.breathing.start')
          }
          accessibilityRole="button"
          testID="breathing-action-button"
        >
          <Text style={styles.actionButtonText}>
            {isActive
              ? t('journeys.health.wellness.breathing.pause')
              : t('journeys.health.wellness.breathing.start')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacingValues.md,
      paddingVertical: spacingValues.sm,
      backgroundColor: colors.brand.primary,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backArrow: {
      fontSize: 20,
      color: theme.colors.text.onBrand,
      fontWeight: '600',
    },
    screenTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text.onBrand,
      textAlign: 'center',
    },
    headerSpacer: {
      width: 40,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacingValues.md,
    },
    circleContainer: {
      width: 220,
      height: 220,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacingValues['2xl'],
    },
    breathingCircle: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: colors.brand.secondary + '30',
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.brand.secondary + '50',
      alignItems: 'center',
      justifyContent: 'center',
    },
    phaseText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.default,
      textAlign: 'center',
    },
    timerText: {
      fontSize: 36,
      fontWeight: '700',
      color: theme.colors.text.default,
      marginBottom: spacingValues.xs,
    },
    cycleText: {
      fontSize: 14,
      color: theme.colors.text.muted,
      marginBottom: spacingValues['2xl'],
    },
    durationRow: {
      flexDirection: 'row',
      gap: spacingValues.sm,
      marginBottom: spacingValues.lg,
    },
    durationChip: {
      paddingVertical: spacingValues.xs,
      paddingHorizontal: spacingValues.lg,
      borderRadius: borderRadiusValues.full,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      backgroundColor: 'transparent',
    },
    durationChipSelected: {
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
    },
    durationText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.default,
    },
    durationTextSelected: {
      color: theme.colors.text.onBrand,
    },
    actionButton: {
      paddingVertical: spacingValues.sm,
      paddingHorizontal: spacingValues['3xl'],
      backgroundColor: colors.brand.primary,
      borderRadius: borderRadiusValues.full,
    },
    actionButtonPause: {
      backgroundColor: colors.semantic.warning,
    },
    actionButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.onBrand,
    },
  });

export default CompanionBreathingScreen;
