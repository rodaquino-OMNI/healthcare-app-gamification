import React, { useState } from 'react';
import { FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { SettingsNavigationProp } from '../../navigation/types';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
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
  background-color: ${({ theme }) => theme.colors.background.default};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border.default};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  margin-horizontal: ${spacing.xl};
  margin-bottom: ${spacing.md};
`;

const CardTopRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing.sm};
  gap: ${spacing.xs};
`;

const LabelBadge = styled.View`
  background-color: ${colors.brand.primary}15;
  padding-horizontal: ${spacing.sm};
  padding-vertical: ${spacing['3xs']};
  border-radius: ${borderRadius.full};
`;

const LabelBadgeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.brand.primary};
`;

const PrimaryBadge = styled.View`
  background-color: ${colors.semantic.success}20;
  padding-horizontal: ${spacing.sm};
  padding-vertical: ${spacing['3xs']};
  border-radius: ${borderRadius.full};
`;

const PrimaryBadgeText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.semantic.success};
`;

const AddressStreet = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: ${spacing['3xs']};
`;

const AddressDetail = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${({ theme }) => theme.colors.text.muted};
  margin-bottom: ${spacing['4xs']};
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${spacing.sm};
  gap: ${spacing.sm};
`;

const EditButton = styled.TouchableOpacity`
  padding-vertical: ${spacing.xs};
  padding-horizontal: ${spacing.md};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${colors.brand.primary};
`;

const EditButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.brand.primary};
`;

const DeleteButton = styled.TouchableOpacity`
  padding-vertical: ${spacing.xs};
  padding-horizontal: ${spacing.md};
  border-radius: ${borderRadius.md};
  border-width: 1px;
  border-color: ${colors.semantic.error};
`;

const DeleteButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.semantic.error};
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  height: ${sizing.component.lg};
  align-items: center;
  justify-content: center;
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.md};
  margin-bottom: ${spacing['2xl']};
`;

const AddButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.onBrand};
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

interface Address {
  id: string;
  label: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  isPrimary: boolean;
}

// --- Mock Data ---

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    label: 'Casa',
    street: 'Rua das Flores, 123',
    neighborhood: 'Jardim Paulista',
    city: 'Sao Paulo',
    state: 'SP',
    cep: '01234-567',
    isPrimary: true,
  },
  {
    id: '2',
    label: 'Trabalho',
    street: 'Av. Paulista, 1000',
    neighborhood: 'Bela Vista',
    city: 'Sao Paulo',
    state: 'SP',
    cep: '01310-100',
    isPrimary: false,
  },
];

/**
 * Addresses screen -- lists saved addresses with label badges,
 * primary indicator, full formatted address, and Edit/Delete actions.
 */
export const AddressesScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);

  const handleDelete = (addr: Address) => {
    Alert.alert(
      t('settings.addresses.delete'),
      `${addr.label} - ${addr.street}?`,
      [
        { text: t('settings.addresses.cancel'), style: 'cancel' },
        {
          text: t('settings.addresses.delete'),
          style: 'destructive',
          onPress: () => {
            setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
          },
        },
      ],
    );
  };

  const handleEdit = (_addr: Address) => {
    // TODO: navigate with pre-filled data
    navigation.navigate(ROUTES.SETTINGS_ADD_ADDRESS);
  };

  const handleAdd = () => {
    navigation.navigate(ROUTES.SETTINGS_ADD_ADDRESS);
  };

  const getLabelTranslation = (label: string): string => {
    switch (label) {
      case 'Casa': return t('settings.addresses.labels.home');
      case 'Trabalho': return t('settings.addresses.labels.work');
      default: return t('settings.addresses.labels.other');
    }
  };

  const renderItem = ({ item }: { item: Address }) => (
    <Card testID={`address-card-${item.id}`}>
      <CardTopRow>
        <LabelBadge>
          <LabelBadgeText>{getLabelTranslation(item.label)}</LabelBadgeText>
        </LabelBadge>
        {item.isPrimary && (
          <PrimaryBadge>
            <PrimaryBadgeText>{t('settings.addresses.primary')}</PrimaryBadgeText>
          </PrimaryBadge>
        )}
      </CardTopRow>
      <AddressStreet>{item.street}</AddressStreet>
      <AddressDetail>{item.neighborhood}</AddressDetail>
      <AddressDetail>{`${item.city} - ${item.state}`}</AddressDetail>
      <AddressDetail>{`CEP: ${item.cep}`}</AddressDetail>
      <ButtonRow>
        <EditButton
          onPress={() => handleEdit(item)}
          accessibilityRole="button"
          accessibilityLabel={`${t('settings.addresses.edit')} ${item.label}`}
          testID={`address-edit-${item.id}`}
        >
          <EditButtonText>{t('settings.addresses.edit')}</EditButtonText>
        </EditButton>
        <DeleteButton
          onPress={() => handleDelete(item)}
          accessibilityRole="button"
          accessibilityLabel={`${t('settings.addresses.delete')} ${item.label}`}
          testID={`address-delete-${item.id}`}
        >
          <DeleteButtonText>{t('settings.addresses.delete')}</DeleteButtonText>
        </DeleteButton>
      </ButtonRow>
    </Card>
  );

  const renderEmpty = () => (
    <EmptyContainer>
      <EmptyText>{t('settings.addresses.empty')}</EmptyText>
    </EmptyContainer>
  );

  return (
    <Container>
      <Header>
        <Title>{t('settings.addresses.title')}</Title>
      </Header>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: spacingValues['4xl'],
          flexGrow: addresses.length === 0 ? 1 : undefined,
        }}
      />
      <AddButton
        onPress={handleAdd}
        accessibilityRole="button"
        accessibilityLabel={t('settings.addresses.addAddress')}
        testID="addresses-add-button"
      >
        <AddButtonText>{t('settings.addresses.addAddress')}</AddButtonText>
      </AddButton>
    </Container>
  );
};

export default AddressesScreen;
