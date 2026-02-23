import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FERTILE_DAYS = [11, 12, 13, 14, 15, 16];
const OVULATION_DAY = 14;

const INFO_ITEMS = [
  { title: 'Fertile Window', text: 'The fertile window typically spans 6 days: 5 days before ovulation and the day of ovulation itself.' },
  { title: 'Ovulation', text: 'Ovulation occurs when an egg is released from the ovary. It usually happens around day 14 of a 28-day cycle.' },
  { title: 'Tracking Tips', text: 'Track basal body temperature and cervical mucus changes for more accurate fertility predictions.' },
];

const generateMonthDays = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, (_, i) => ({ key: `b-${i}`, day: 0 }));
  const days = Array.from({ length: daysInMonth }, (_, i) => ({ key: `d-${i + 1}`, day: i + 1 }));
  return [...blanks, ...days];
};

const FertilityPage: React.FC = () => {
  const router = useRouter();
  const calendarDays = useMemo(generateMonthDays, []);
  const today = new Date().getDate();
  const monthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const getDayBg = (day: number): string => {
    if (day === OVULATION_DAY) return `${colors.semantic.warning}40`;
    if (FERTILE_DAYS.includes(day)) return `${colors.journeys.health.primary}22`;
    return 'transparent';
  };

  const getDayBorder = (day: number): string => {
    if (day === OVULATION_DAY) return `2px solid ${colors.semantic.warning}`;
    return '2px solid transparent';
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: spacing.xl }}>
      <button
        onClick={() => router.push('/health/cycle')}
        style={{ background: 'none', border: 'none', color: colors.journeys.health.primary, cursor: 'pointer', fontSize: '14px', fontWeight: 500, padding: 0 }}
        aria-label="Back to cycle home"
      >
        Back
      </button>

      <Text fontSize="2xl" fontWeight="bold" color={colors.journeys.health.text} style={{ marginTop: spacing.md }}>
        Fertility Window
      </Text>
      <Text fontSize="md" color={colors.gray[50]} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Track your fertile days and ovulation
      </Text>

      <Card journey="health" elevation="sm" padding="md">
        <Text fontWeight="semiBold" fontSize="lg" style={{ marginBottom: spacing.sm }}>{monthName}</Text>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: spacing['3xs'], textAlign: 'center' }}>
          {DAY_LABELS.map((d) => (
            <Text key={d} fontSize="xs" fontWeight="semiBold" color={colors.gray[40]}>{d}</Text>
          ))}
          {calendarDays.map((cell) => (
            <div key={cell.key} style={{
              height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', backgroundColor: cell.day > 0 ? getDayBg(cell.day) : 'transparent',
              border: cell.day > 0 ? getDayBorder(cell.day) : 'none',
            }}>
              {cell.day > 0 && (
                <Text fontSize="sm" fontWeight={cell.day === today ? 'bold' : 'regular'} color={cell.day === OVULATION_DAY ? colors.semantic.warning : colors.gray[60]}>
                  {cell.day}
                </Text>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Box display="flex" style={{ gap: spacing.md, marginTop: spacing.lg, marginBottom: spacing['2xl'] }}>
        <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: `${colors.journeys.health.primary}44` }} />
          <Text fontSize="xs" color={colors.gray[50]}>Fertile</Text>
        </Box>
        <Box display="flex" alignItems="center" style={{ gap: spacing.xs }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: `${colors.semantic.warning}66`, border: `2px solid ${colors.semantic.warning}` }} />
          <Text fontSize="xs" color={colors.gray[50]}>Ovulation</Text>
        </Box>
      </Box>

      <Card journey="health" elevation="sm" padding="md" style={{ marginBottom: spacing.xl }}>
        <Text fontWeight="semiBold" fontSize="md" color={colors.journeys.health.text}>Probability</Text>
        <Box display="flex" justifyContent="space-between" style={{ marginTop: spacing.sm }}>
          <Box>
            <Text fontSize="sm" color={colors.gray[50]}>Conception Chance</Text>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>Low (5%)</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color={colors.gray[50]}>Days Until Fertile</Text>
            <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.primary}>17 days</Text>
          </Box>
        </Box>
      </Card>

      <Text fontSize="lg" fontWeight="semiBold" color={colors.journeys.health.text} style={{ marginBottom: spacing.sm }}>
        Learn More
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {INFO_ITEMS.map((item) => (
          <Card key={item.title} journey="health" elevation="sm" padding="md">
            <Text fontWeight="semiBold" fontSize="md" color={colors.journeys.health.text}>{item.title}</Text>
            <Text fontSize="sm" color={colors.gray[50]} style={{ marginTop: spacing['3xs'] }}>{item.text}</Text>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FertilityPage;
