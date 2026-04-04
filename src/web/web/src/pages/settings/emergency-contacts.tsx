import { colors, typography, spacing, borderRadius } from 'design-system/tokens';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/hooks/useSettings';

interface Contact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
}

const MOCK_CONTACTS: Contact[] = [
    { id: '1', name: 'Carlos Silva', relationship: 'Esposo', phone: '(11) 98888-7777', isPrimary: true },
    { id: '2', name: 'Rosa Santos', relationship: 'Mae', phone: '(11) 97777-6666', isPrimary: false },
];

/**
 * Emergency contacts page.
 * Displays and manages emergency contact list.
 */
const EmergencyContactsPage: NextPage = () => {
    const { t } = useTranslation();
    const { isLoading, error } = useSettings();
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newRelationship, setNewRelationship] = useState('');

    const handleAdd = (): void => {
        if (!newName || !newPhone || !newRelationship) {
            return;
        }
        const contact: Contact = {
            id: String(Date.now()),
            name: newName,
            phone: newPhone,
            relationship: newRelationship,
            isPrimary: contacts.length === 0,
        };
        setContacts([...contacts, contact]);
        setNewName('');
        setNewPhone('');
        setNewRelationship('');
        setShowForm(false);
    };

    const handleRemove = (id: string): void => {
        setContacts(contacts.filter((c) => c.id !== id));
    };

    const setPrimary = (id: string): void => {
        setContacts(contacts.map((c) => ({ ...c, isPrimary: c.id === id })));
    };

    return (
        <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={titleStyle}>Contatos de Emergencia</h1>
            <p style={subtitleStyle}>Pessoas a serem notificadas em caso de emergencia.</p>
            {isLoading && (
                <p
                    style={{
                        fontSize: typography.fontSize['text-sm'],
                        color: colors.gray[40],
                        marginBottom: spacing.md,
                    }}
                >
                    {t('common.loading')}
                </p>
            )}
            {error && (
                <p
                    style={{
                        fontSize: typography.fontSize['text-sm'],
                        color: colors.semantic.error,
                        marginBottom: spacing.md,
                    }}
                >
                    {error}
                </p>
            )}

            {contacts.map((contact) => (
                <div key={contact.id} style={{ ...cardStyle, marginBottom: spacing.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={contactNameStyle}>{contact.name}</h3>
                            <span style={contactRelStyle}>{contact.relationship}</span>
                        </div>
                        {contact.isPrimary && <span style={primaryBadgeStyle}>Principal</span>}
                    </div>
                    <p style={phoneStyle}>{contact.phone}</p>
                    <div style={{ display: 'flex', gap: spacing.xs }}>
                        {!contact.isPrimary && (
                            <button onClick={() => setPrimary(contact.id)} style={actionBtnStyle}>
                                Definir como Principal
                            </button>
                        )}
                        <button onClick={() => handleRemove(contact.id)} style={removeBtnStyle}>
                            Remover
                        </button>
                    </div>
                </div>
            ))}

            {showForm ? (
                <div style={{ ...cardStyle, marginTop: spacing.md }}>
                    <h3 style={sectionTitleStyle}>Novo Contato</h3>
                    <div style={fieldGroup}>
                        <label htmlFor="ec-name" style={labelStyle}>
                            Nome
                        </label>
                        <input
                            id="ec-name"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            style={inputStyle}
                            placeholder="Nome completo"
                        />
                    </div>
                    <div style={fieldGroup}>
                        <label htmlFor="ec-phone" style={labelStyle}>
                            Telefone
                        </label>
                        <input
                            id="ec-phone"
                            type="tel"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            style={inputStyle}
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                    <div style={fieldGroup}>
                        <label htmlFor="ec-relationship" style={labelStyle}>
                            Parentesco
                        </label>
                        <input
                            id="ec-relationship"
                            type="text"
                            value={newRelationship}
                            onChange={(e) => setNewRelationship(e.target.value)}
                            style={inputStyle}
                            placeholder="Ex: Esposo, Mae, Amigo"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: spacing.xs }}>
                        <button onClick={handleAdd} style={saveBtnStyle}>
                            Adicionar
                        </button>
                        <button onClick={() => setShowForm(false)} style={cancelBtnStyle}>
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowForm(true)} style={addBtnStyle}>
                    + Adicionar Contato
                </button>
            )}
        </div>
    );
};

const titleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-xl'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.heading,
};
const subtitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[50],
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily.body,
};
const cardStyle: React.CSSProperties = {
    backgroundColor: colors.gray[0],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const contactNameStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[70],
    margin: 0,
    fontFamily: typography.fontFamily.body,
};
const contactRelStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    color: colors.gray[40],
    fontFamily: typography.fontFamily.body,
};
const primaryBadgeStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-xs'],
    fontWeight: typography.fontWeight.medium,
    color: colors.brand.primary,
    backgroundColor: colors.brandPalette[50],
    padding: `${spacing['3xs']} ${spacing.xs}`,
    borderRadius: borderRadius.full,
};
const phoneStyle: React.CSSProperties = {
    fontSize: typography.fontSize['text-sm'],
    color: colors.gray[60],
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.body,
};
const actionBtnStyle: React.CSSProperties = {
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: colors.gray[10],
    color: colors.gray[60],
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-xs'],
    fontFamily: typography.fontFamily.body,
};
const removeBtnStyle: React.CSSProperties = {
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: 'transparent',
    color: colors.semantic.error,
    border: `1px solid ${colors.semantic.error}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-xs'],
    fontFamily: typography.fontFamily.body,
};
const sectionTitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize['heading-sm'],
    fontWeight: typography.fontWeight.semiBold,
    color: colors.gray[60],
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.heading,
};
const fieldGroup: React.CSSProperties = { marginBottom: spacing.md };
const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[60],
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.body,
};
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.gray[20]}`,
    fontSize: typography.fontSize['text-md'],
    fontFamily: typography.fontFamily.body,
    color: colors.gray[70],
    boxSizing: 'border-box',
};
const saveBtnStyle: React.CSSProperties = {
    flex: 1,
    padding: spacing.sm,
    backgroundColor: colors.brand.primary,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontWeight: typography.fontWeight.semiBold,
    fontFamily: typography.fontFamily.body,
};
const cancelBtnStyle: React.CSSProperties = {
    flex: 1,
    padding: spacing.sm,
    backgroundColor: 'transparent',
    color: colors.gray[50],
    border: `1px solid ${colors.gray[20]}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-sm'],
    fontFamily: typography.fontFamily.body,
};
const addBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: spacing.sm,
    backgroundColor: colors.gray[0],
    color: colors.brand.primary,
    border: `2px dashed ${colors.brand.primary}`,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    fontSize: typography.fontSize['text-md'],
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily.body,
    marginTop: spacing.md,
};

export const getServerSideProps = () => ({ props: {} });

export default EmergencyContactsPage;
