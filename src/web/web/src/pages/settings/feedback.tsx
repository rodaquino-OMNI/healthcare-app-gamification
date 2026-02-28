import React, { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';
import { submitFeedback } from '../../api/settings';

/**
 * App feedback page.
 * Allows users to rate the app and leave comments.
 */
const FeedbackPage: NextPage = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'usability', label: 'Usabilidade' },
    { value: 'performance', label: 'Desempenho' },
    { value: 'features', label: 'Funcionalidades' },
    { value: 'design', label: 'Design' },
    { value: 'support', label: 'Suporte' },
    { value: 'other', label: 'Outro' },
  ];

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    setError('');
    try {
      await submitFeedback({ rating, category, comment });
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar feedback.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: spacing.xl, maxWidth: '480px', margin: '0 auto', textAlign: 'center' as const, paddingTop: spacing['5xl'] }}>
        <div style={successIconStyle}>&#10003;</div>
        <h1 style={{ ...titleStyle, textAlign: 'center' as const }}>Obrigada pelo Feedback!</h1>
        <p style={{ fontSize: typography.fontSize['text-sm'], color: colors.gray[50], marginBottom: spacing.xl }}>
          Sua opiniao nos ajuda a melhorar continuamente.
        </p>
        <button onClick={() => router.push('/settings')} style={primaryButtonStyle}>
          Voltar para Configuracoes
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: spacing.xl, maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Sua Opiniao</h1>
      <p style={subtitleStyle}>Nos conte como esta sendo sua experiencia com o AUSTA.</p>

      <div style={cardStyle}>
        {/* Star rating */}
        <div style={{ marginBottom: spacing.xl }}>
          <label style={labelStyle}>Avaliacao Geral</label>
          <div style={{ display: 'flex', gap: spacing.xs, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: '32px', background: 'none', border: 'none',
                  cursor: 'pointer', color: star <= rating ? colors.semantic.warning : colors.gray[20],
                  transition: 'color 0.15s',
                }}
                aria-label={`${star} estrelas`}
              >
                &#9733;
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ textAlign: 'center' as const, fontSize: typography.fontSize['text-xs'], color: colors.gray[40], marginTop: spacing.xs }}>
              {rating === 1 && 'Muito ruim'}
              {rating === 2 && 'Ruim'}
              {rating === 3 && 'Regular'}
              {rating === 4 && 'Bom'}
              {rating === 5 && 'Excelente'}
            </p>
          )}
        </div>

        {/* Category */}
        <div style={fieldGroup}>
          <label style={labelStyle}>Categoria (opcional)</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
            <option value="">Selecione...</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div style={fieldGroup}>
          <label style={labelStyle}>Comentario (opcional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={textareaStyle}
            rows={4}
            placeholder="Conte-nos mais sobre sua experiencia..."
          />
        </div>

        {error && (
          <p style={{ color: colors.semantic.error, fontSize: typography.fontSize['text-sm'], marginBottom: spacing.sm, fontFamily: typography.fontFamily.body }}>
            {error}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
          style={{
            ...primaryButtonStyle,
            backgroundColor: rating > 0 && !loading ? colors.brand.primary : colors.gray[30],
            cursor: rating > 0 && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Enviando...' : 'Enviar Feedback'}
        </button>
      </div>
    </div>
  );
};

const titleStyle: React.CSSProperties = {
  fontSize: typography.fontSize['heading-xl'], fontWeight: typography.fontWeight.semiBold,
  color: colors.gray[70], marginBottom: spacing.xs, fontFamily: typography.fontFamily.heading,
};
const subtitleStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[50],
  marginBottom: spacing.xl, fontFamily: typography.fontFamily.body,
};
const cardStyle: React.CSSProperties = {
  backgroundColor: colors.gray[0], borderRadius: borderRadius.md,
  padding: spacing.xl, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const fieldGroup: React.CSSProperties = { marginBottom: spacing.lg };
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: typography.fontSize['text-sm'], fontWeight: typography.fontWeight.medium,
  color: colors.gray[60], marginBottom: spacing.xs, fontFamily: typography.fontFamily.body,
};
const selectStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, borderRadius: borderRadius.md,
  border: `1px solid ${colors.gray[20]}`, fontSize: typography.fontSize['text-md'],
  fontFamily: typography.fontFamily.body, color: colors.gray[70], backgroundColor: colors.gray[0],
};
const textareaStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, borderRadius: borderRadius.md,
  border: `1px solid ${colors.gray[20]}`, fontSize: typography.fontSize['text-md'],
  fontFamily: typography.fontFamily.body, color: colors.gray[70],
  resize: 'vertical', boxSizing: 'border-box',
};
const primaryButtonStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, color: colors.neutral.white,
  border: 'none', borderRadius: borderRadius.md,
  fontSize: typography.fontSize['text-md'], fontWeight: typography.fontWeight.semiBold,
  fontFamily: typography.fontFamily.body,
};
const successIconStyle: React.CSSProperties = {
  width: 64, height: 64, borderRadius: '50%',
  backgroundColor: colors.semantic.successBg, color: colors.semantic.success,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: typography.fontSize['heading-xl'], fontWeight: typography.fontWeight.bold,
  margin: '0 auto', marginBottom: spacing.md,
};

export default FeedbackPage;
