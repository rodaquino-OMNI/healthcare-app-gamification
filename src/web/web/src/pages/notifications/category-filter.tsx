import React, { useState, useMemo } from 'react';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';

type CategoryType = 'all' | 'health' | 'care' | 'plan' | 'system';

interface CategoryNotification {
  id: string;
  category: Exclude<CategoryType, 'all'>;
  title: string;
  preview: string;
  timestamp: string;
}

const getCategoryColor = (cat: Exclude<CategoryType, 'all'>): string => {
  switch (cat) {
    case 'health': return colors.journeys.health.primary;
    case 'care': return colors.journeys.care.primary;
    case 'plan': return colors.journeys.plan.primary;
    case 'system': return colors.neutral.gray500;
  }
};

const getCategoryLabel = (cat: Exclude<CategoryType, 'all'>): string => {
  switch (cat) {
    case 'health': return 'Saude';
    case 'care': return 'Consulta';
    case 'plan': return 'Plano';
    case 'system': return 'Sistema';
  }
};

const FILTERS: { key: CategoryType; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'health', label: 'Saude' },
  { key: 'care', label: 'Consulta' },
  { key: 'plan', label: 'Plano' },
  { key: 'system', label: 'Sistema' },
];

const MOCK_NOTIFICATIONS: CategoryNotification[] = [
  { id: 'c1', category: 'health', title: 'Meta de passos', preview: 'Voce atingiu 8.000 de 10.000 passos.', timestamp: '1h' },
  { id: 'c2', category: 'care', title: 'Consulta confirmada', preview: 'Consulta com Dr. Carlos Lima em 25 Fev.', timestamp: '3h' },
  { id: 'c3', category: 'plan', title: 'Cobertura atualizada', preview: 'Plano agora inclui odontologia.', timestamp: '5h' },
  { id: 'c4', category: 'system', title: 'Manutencao', preview: 'Manutencao dia 28 Fev 02:00-04:00.', timestamp: '8h' },
  { id: 'c5', category: 'health', title: 'Medicamento registrado', preview: 'Losartana 50mg tomada com sucesso.', timestamp: '12h' },
  { id: 'c6', category: 'care', title: 'Resultado disponivel', preview: 'Hemograma completo pronto.', timestamp: '1d' },
  { id: 'c7', category: 'plan', title: 'Fatura disponivel', preview: 'Fatura Fev/2026 disponivel.', timestamp: '2d' },
];

const CategoryFilterPage: React.FC = () => {
  const [active, setActive] = useState<CategoryType>('all');

  const filtered = useMemo(() => {
    if (active === 'all') return MOCK_NOTIFICATIONS;
    return MOCK_NOTIFICATIONS.filter((n) => n.category === active);
  }, [active]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notificacoes por Categoria</h1>

      <div style={styles.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            style={{ ...styles.filterBtn, ...(active === f.key ? styles.filterActive : {}) }}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>{'\uD83D\uDD14'}</span>
          <p style={styles.emptyTitle}>Nenhuma notificacao nesta categoria.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((n) => {
            const catColor = getCategoryColor(n.category);
            return (
              <div key={n.id} style={{ ...styles.card, borderLeftColor: catColor }}>
                <div style={styles.cardHeader}>
                  <span style={{ ...styles.badge, color: catColor, backgroundColor: `${catColor}20` }}>
                    {getCategoryLabel(n.category)}
                  </span>
                  <span style={styles.timestamp}>{n.timestamp}</span>
                </div>
                <p style={styles.notifTitle}>{n.title}</p>
                <p style={styles.preview}>{n.preview}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '800px', margin: '0 auto', padding: spacing.xl },
  title: { fontSize: typography.fontSize['heading-xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral.gray900, fontFamily: typography.fontFamily.heading, margin: `0 0 ${spacing.xl} 0` },
  filterRow: { display: 'flex', gap: spacing.xs, marginBottom: spacing.xl, flexWrap: 'wrap' },
  filterBtn: { padding: `${spacing.xs} ${spacing.md}`, backgroundColor: colors.neutral.gray200, color: colors.neutral.gray700, border: 'none', borderRadius: borderRadius.full, fontSize: typography.fontSize['text-sm'], fontWeight: typography.fontWeight.medium, cursor: 'pointer', fontFamily: typography.fontFamily.body, transition: 'all 0.2s' },
  filterActive: { backgroundColor: colors.brand.primary, color: colors.neutral.white },
  list: { display: 'flex', flexDirection: 'column', gap: spacing.sm },
  card: { backgroundColor: colors.neutral.white, borderRadius: borderRadius.md, padding: spacing.md, borderLeft: '4px solid', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing['3xs'] },
  badge: { fontSize: typography.fontSize['text-xs'], fontWeight: typography.fontWeight.semiBold, padding: `${spacing['4xs']} ${spacing.xs}`, borderRadius: borderRadius.xs },
  timestamp: { fontSize: typography.fontSize['text-xs'], color: colors.neutral.gray400, fontFamily: typography.fontFamily.body },
  notifTitle: { fontSize: typography.fontSize['text-md'], fontWeight: typography.fontWeight.bold, color: colors.neutral.gray900, margin: `0 0 ${spacing['4xs']} 0`, fontFamily: typography.fontFamily.body },
  preview: { fontSize: typography.fontSize['text-sm'], color: colors.neutral.gray600, margin: 0, fontFamily: typography.fontFamily.body },
  empty: { textAlign: 'center', padding: spacing['3xl'] },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.fontSize['text-lg'], fontWeight: typography.fontWeight.bold, color: colors.neutral.gray600, margin: 0, fontFamily: typography.fontFamily.heading },
};

export default CategoryFilterPage;
