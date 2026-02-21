import React, { useState } from 'react';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { typography } from 'src/web/design-system/src/tokens/typography';
import { spacing } from 'src/web/design-system/src/tokens/spacing';
import { borderRadius } from 'src/web/design-system/src/tokens/borderRadius';

type NotificationType = 'care' | 'health' | 'plan' | 'system';

interface UnreadNotification {
  id: string;
  type: NotificationType;
  title: string;
  preview: string;
  timestamp: string;
}

const getTypeColor = (type: NotificationType): string => {
  switch (type) {
    case 'care': return colors.journeys.care.primary;
    case 'health': return colors.journeys.health.primary;
    case 'plan': return colors.journeys.plan.primary;
    case 'system': return colors.neutral.gray500;
  }
};

const getTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case 'care': return 'Consulta';
    case 'health': return 'Saude';
    case 'plan': return 'Plano';
    case 'system': return 'Sistema';
  }
};

const MOCK_UNREAD: UnreadNotification[] = [
  { id: 'u1', type: 'care', title: 'Consulta amanha', preview: 'Lembrete: consulta com Dr. Ana Silva as 10:00.', timestamp: '2h' },
  { id: 'u2', type: 'health', title: 'Meta de passos', preview: 'Voce atingiu 10.000 passos hoje!', timestamp: '4h' },
  { id: 'u3', type: 'plan', title: 'Reembolso aprovado', preview: 'Pedido #4523 aprovado.', timestamp: '6h' },
  { id: 'u4', type: 'system', title: 'Nova versao', preview: 'Atualizacao disponivel.', timestamp: '1d' },
  { id: 'u5', type: 'health', title: 'Medicamento pendente', preview: 'Hora de tomar Losartana 50mg.', timestamp: '1d' },
];

const UnreadNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(MOCK_UNREAD);

  const handleMarkAllRead = () => setNotifications([]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Nao Lidas</h1>
        {notifications.length > 0 && (
          <button style={styles.markAllBtn} onClick={handleMarkAllRead}>Marcar todas como lidas</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>{'\u2705'}</span>
          <p style={styles.emptyTitle}>Tudo lido!</p>
          <p style={styles.emptyDesc}>Nenhuma notificacao nao lida.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map((n) => {
            const typeColor = getTypeColor(n.type);
            return (
              <div key={n.id} style={{ ...styles.card, borderLeftColor: typeColor }}>
                <div style={styles.cardRow}>
                  <div style={{ ...styles.dot, backgroundColor: typeColor }} />
                  <div style={styles.content}>
                    <div style={styles.cardHeader}>
                      <span style={{ ...styles.badge, color: typeColor, backgroundColor: `${typeColor}20` }}>
                        {getTypeLabel(n.type)}
                      </span>
                      <span style={styles.timestamp}>{n.timestamp}</span>
                    </div>
                    <p style={styles.notifTitle}>{n.title}</p>
                    <p style={styles.preview}>{n.preview}</p>
                  </div>
                </div>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: typography.fontSize['heading-xl'], fontWeight: typography.fontWeight.bold, color: colors.neutral.gray900, fontFamily: typography.fontFamily.heading, margin: 0 },
  markAllBtn: { backgroundColor: 'transparent', border: 'none', color: colors.brand.primary, fontSize: typography.fontSize['text-sm'], fontWeight: typography.fontWeight.semiBold, cursor: 'pointer', fontFamily: typography.fontFamily.body },
  list: { display: 'flex', flexDirection: 'column', gap: spacing.sm },
  card: { backgroundColor: colors.neutral.white, borderRadius: borderRadius.md, padding: spacing.md, borderLeft: '4px solid', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  cardRow: { display: 'flex', alignItems: 'flex-start' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', marginRight: spacing.sm, marginTop: '6px', flexShrink: 0 },
  content: { flex: 1 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing['3xs'] },
  badge: { fontSize: typography.fontSize['text-xs'], fontWeight: typography.fontWeight.semiBold, padding: `${spacing['4xs']} ${spacing.xs}`, borderRadius: borderRadius.xs },
  timestamp: { fontSize: typography.fontSize['text-xs'], color: colors.neutral.gray400, fontFamily: typography.fontFamily.body },
  notifTitle: { fontSize: typography.fontSize['text-md'], fontWeight: typography.fontWeight.bold, color: colors.neutral.gray900, margin: `0 0 ${spacing['4xs']} 0`, fontFamily: typography.fontFamily.body },
  preview: { fontSize: typography.fontSize['text-sm'], color: colors.neutral.gray600, margin: 0, fontFamily: typography.fontFamily.body },
  empty: { textAlign: 'center', padding: spacing['3xl'] },
  emptyIcon: { fontSize: '48px', display: 'block', marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.fontSize['text-lg'], fontWeight: typography.fontWeight.bold, color: colors.neutral.gray600, margin: `0 0 ${spacing.xs} 0`, fontFamily: typography.fontFamily.heading },
  emptyDesc: { fontSize: typography.fontSize['text-sm'], color: colors.neutral.gray500, margin: 0, fontFamily: typography.fontFamily.body },
};

export default UnreadNotificationsPage;
