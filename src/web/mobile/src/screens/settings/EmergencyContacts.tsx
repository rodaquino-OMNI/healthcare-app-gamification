import React, { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { colors } from '@design-system/tokens/colors';
import { typography } from '@design-system/tokens/typography';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { borderRadius } from '@design-system/tokens/borderRadius';
import { sizing } from '@design-system/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing.lg};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const Card = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.default};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  margin-horizontal: ${spacing.xl};
  margin-bottom: ${spacing.sm};
`;

const PriorityBadge = styled.View`
  width: ${sizing.component.sm};
  height: ${sizing.component.sm};
  border-radius: 16px;
  background-color: ${colors.semantic.info};
  align-items: center;
  justify-content: center;
  margin-right: ${spacing.md};
`;

const PriorityText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const ContactInfo = styled.View`
  flex: 1;
`;

const ContactName = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const ContactPhone = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-top: ${spacing['4xs']};
`;

const ContactRelationship = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.subtle};
  margin-top: ${spacing['4xs']};
`;

const ActionRow = styled.View`
  flex-direction: row;
  gap: ${spacing.sm};
`;

const IconButton = styled.TouchableOpacity`
  width: ${sizing.component.sm};
  height: ${sizing.component.sm};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
`;

const IconText = styled.Text`
  font-size: ${typography.fontSize['text-sm']};
  color: ${({ theme }) => theme.colors.text.default};
`;

const DeleteIconText = styled.Text`
  font-size: ${typography.fontSize['text-sm']};
  color: ${colors.semantic.error};
`;

const AddContactButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.md};
`;

const AddContactButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const InlineForm = styled.View`
  background-color: ${({ theme }) => theme.colors.background.muted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  margin-horizontal: ${spacing.xl};
  margin-bottom: ${spacing.md};
`;

const FormLabel = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing.xs};
`;

const FormInput = styled.TextInput`
  height: ${sizing.component.md};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.md};
  padding-horizontal: ${spacing.md};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.default};
  background-color: ${({ theme }) => theme.colors.background.default};
  margin-bottom: ${spacing.sm};
`;

const FormButtonRow = styled.View`
  flex-direction: row;
  gap: ${spacing.sm};
  margin-top: ${spacing.xs};
`;

const FormSaveButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.md};
  align-items: center;
  justify-content: center;
`;

const FormSaveText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

const FormCancelButton = styled.TouchableOpacity`
  flex: 1;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.md};
  align-items: center;
  justify-content: center;
`;

const FormCancelText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${spacing['4xl']};
`;

const EmptyText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`;

// --- Types ---

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

// --- Mock Data ---

const MOCK_CONTACTS: EmergencyContact[] = [
  { id: '1', name: 'Maria Silva', phone: '+55 11 98765-4321', relationship: 'Mae', priority: 1 },
  { id: '2', name: 'Joao Santos', phone: '+55 11 91234-5678', relationship: 'Amigo', priority: 2 },
];

/**
 * EmergencyContacts screen -- manages the user's emergency contact list.
 * Each contact shows priority badge, name, phone, relationship,
 * and inline Edit/Delete actions. Inline add form on "Add Contact".
 */
export const EmergencyContactsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<EmergencyContact[]>(MOCK_CONTACTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelationship, setNewRelationship] = useState('');

  const handleDelete = (contact: EmergencyContact) => {
    Alert.alert(
      t('settings.emergencyContacts.delete'),
      `${contact.name}?`,
      [
        { text: t('settings.emergencyContacts.cancel'), style: 'cancel' },
        {
          text: t('settings.emergencyContacts.delete'),
          style: 'destructive',
          onPress: () => {
            setContacts((prev) => prev.filter((c) => c.id !== contact.id));
          },
        },
      ],
    );
  };

  const handleAddSave = () => {
    if (!newName.trim() || !newPhone.trim()) return;

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim(),
      relationship: newRelationship.trim() || '-',
      priority: contacts.length + 1,
    };

    setContacts((prev) => [...prev, newContact]);
    setNewName('');
    setNewPhone('');
    setNewRelationship('');
    setShowAddForm(false);
  };

  const renderItem = ({ item }: { item: EmergencyContact }) => (
    <Card testID={`contact-card-${item.id}`}>
      <PriorityBadge>
        <PriorityText>{item.priority}</PriorityText>
      </PriorityBadge>
      <ContactInfo>
        <ContactName>{item.name}</ContactName>
        <ContactPhone>{item.phone}</ContactPhone>
        <ContactRelationship>{item.relationship}</ContactRelationship>
      </ContactInfo>
      <ActionRow>
        <IconButton
          onPress={() => {/* TODO: edit mode */}}
          accessibilityRole="button"
          accessibilityLabel={`${t('settings.emergencyContacts.edit')} ${item.name}`}
          testID={`contact-edit-${item.id}`}
        >
          <IconText>{'E'}</IconText>
        </IconButton>
        <IconButton
          onPress={() => handleDelete(item)}
          accessibilityRole="button"
          accessibilityLabel={`${t('settings.emergencyContacts.delete')} ${item.name}`}
          testID={`contact-delete-${item.id}`}
        >
          <DeleteIconText>{'X'}</DeleteIconText>
        </IconButton>
      </ActionRow>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyContainer>
      <EmptyText>{t('settings.emergencyContacts.empty')}</EmptyText>
    </EmptyContainer>
  );

  return (
    <Container>
      <Header>
        <Title>{t('settings.emergencyContacts.title')}</Title>
      </Header>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacingValues['4xl'],
          flexGrow: contacts.length === 0 ? 1 : undefined,
        }}
        ListFooterComponent={
          showAddForm ? (
            <InlineForm>
              <FormLabel>{t('settings.emergencyContacts.name')}</FormLabel>
              <FormInput
                value={newName}
                onChangeText={setNewName}
                placeholder={t('settings.emergencyContacts.name')}
                placeholderTextColor={colors.gray[40]}
                testID="contact-add-name"
              />
              <FormLabel>{t('settings.emergencyContacts.phone')}</FormLabel>
              <FormInput
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="+55 11 99999-9999"
                placeholderTextColor={colors.gray[40]}
                keyboardType="phone-pad"
                testID="contact-add-phone"
              />
              <FormLabel>{t('settings.emergencyContacts.relationship')}</FormLabel>
              <FormInput
                value={newRelationship}
                onChangeText={setNewRelationship}
                placeholder={t('settings.emergencyContacts.relationship')}
                placeholderTextColor={colors.gray[40]}
                testID="contact-add-relationship"
              />
              <FormButtonRow>
                <FormSaveButton
                  onPress={handleAddSave}
                  accessibilityRole="button"
                  accessibilityLabel={t('settings.emergencyContacts.save')}
                  testID="contact-add-save"
                >
                  <FormSaveText>{t('settings.emergencyContacts.save')}</FormSaveText>
                </FormSaveButton>
                <FormCancelButton
                  onPress={() => setShowAddForm(false)}
                  accessibilityRole="button"
                  accessibilityLabel={t('settings.emergencyContacts.cancel')}
                  testID="contact-add-cancel"
                >
                  <FormCancelText>{t('settings.emergencyContacts.cancel')}</FormCancelText>
                </FormCancelButton>
              </FormButtonRow>
            </InlineForm>
          ) : null
        }
      />
      {!showAddForm && (
        <AddContactButton
          onPress={() => setShowAddForm(true)}
          accessibilityRole="button"
          accessibilityLabel={t('settings.emergencyContacts.addContact')}
          testID="contacts-add-button"
        >
          <AddContactButtonText>{t('settings.emergencyContacts.addContact')}</AddContactButtonText>
        </AddContactButton>
      )}
    </Container>
  );
};

export default EmergencyContactsScreen;
