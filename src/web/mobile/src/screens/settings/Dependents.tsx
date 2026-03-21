/* eslint-disable @typescript-eslint/explicit-function-return-type -- return types are inferred from implementation context */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- return types are inferred from implementation context */
import { borderRadius } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { sizing } from '@design-system/tokens/sizing';
import { spacing, spacingValues } from '@design-system/tokens/spacing';
import { typography } from '@design-system/tokens/typography';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Alert, ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';

import { restClient } from '../../api/client';
import { ROUTES } from '../../constants/routes';
import type { SettingsNavigationProp } from '../../navigation/types';

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

const CardHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${spacing.sm};
`;

const DependentName = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-lg']};
    font-weight: ${typography.fontWeight.semiBold};
    color: ${({ theme }) => theme.colors.text.default};
    flex: 1;
`;

const RelationshipBadge = styled.View`
    background-color: ${colors.brand.primary}15;
    padding-horizontal: ${spacing.sm};
    padding-vertical: ${spacing['3xs']};
    border-radius: ${borderRadius.full};
`;

const RelationshipText = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-xs']};
    font-weight: ${typography.fontWeight.medium};
    color: ${colors.brand.primary};
`;

const InfoRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${spacing['3xs']};
`;

const InfoLabel = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.muted};
    width: 100px;
`;

const InfoValue = styled.Text`
    font-family: ${typography.fontFamily.body};
    font-size: ${typography.fontSize['text-sm']};
    font-weight: ${typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text.default};
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

const RemoveButton = styled.TouchableOpacity`
    padding-vertical: ${spacing.xs};
    padding-horizontal: ${spacing.md};
    border-radius: ${borderRadius.md};
    border-width: 1px;
    border-color: ${colors.semantic.error};
`;

const RemoveButtonText = styled.Text`
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

interface Dependent {
    id: string;
    name: string;
    relationship: string;
    dob: string;
    cpf: string;
}

/**
 * Dependents screen -- lists family members linked to the user's health plan.
 * Each card shows name, relationship badge, date of birth, masked CPF,
 * and Edit/Remove action buttons.
 */
export const DependentsScreen: React.FC = () => {
    const navigation = useNavigation<SettingsNavigationProp>();
    const { t } = useTranslation();
    const [dependents, setDependents] = useState<Dependent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDependents = async () => {
            setIsLoading(true);
            try {
                const response = await restClient.get<Dependent[]>('/users/me/dependents');
                setDependents(response.data);
            } catch (err: unknown) {
                Alert.alert(
                    t('settings.dependents.error'),
                    err instanceof Error ? err.message : t('settings.dependents.errorMessage')
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchDependents();
    }, [t]);

    const handleRemove = (dep: Dependent): void => {
        Alert.alert(t('settings.dependents.confirmRemove'), `${dep.name}?`, [
            { text: t('settings.dependents.cancel'), style: 'cancel' },
            {
                text: t('settings.dependents.remove'),
                style: 'destructive',
                onPress: async () => {
                    try {
                        await restClient.delete(`/users/me/dependents/${dep.id}`);
                        setDependents((prev) => prev.filter((d) => d.id !== dep.id));
                    } catch (err: unknown) {
                        Alert.alert(
                            t('settings.dependents.error'),
                            err instanceof Error ? err.message : t('settings.dependents.errorMessage')
                        );
                    }
                },
            },
        ]);
    };

    const handleEdit = (dep: Dependent): void => {
        navigation.navigate(ROUTES.SETTINGS_ADD_DEPENDENT, { dependent: dep });
    };

    const handleAdd = (): void => {
        navigation.navigate(ROUTES.SETTINGS_ADD_DEPENDENT);
    };

    const renderItem = ({ item }: { item: Dependent }): React.ReactElement | null => (
        <Card testID={`dependent-card-${item.id}`}>
            <CardHeader>
                <DependentName>{item.name}</DependentName>
                <RelationshipBadge>
                    <RelationshipText>{item.relationship}</RelationshipText>
                </RelationshipBadge>
            </CardHeader>
            <InfoRow>
                <InfoLabel>{t('settings.dependents.dob')}</InfoLabel>
                <InfoValue>{item.dob}</InfoValue>
            </InfoRow>
            <InfoRow>
                <InfoLabel>{t('settings.dependents.cpf')}</InfoLabel>
                <InfoValue>{item.cpf}</InfoValue>
            </InfoRow>
            <ButtonRow>
                <EditButton
                    onPress={() => handleEdit(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('settings.dependents.edit')} ${item.name}`}
                    testID={`dependent-edit-${item.id}`}
                >
                    <EditButtonText>{t('settings.dependents.edit')}</EditButtonText>
                </EditButton>
                <RemoveButton
                    onPress={() => handleRemove(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${t('settings.dependents.remove')} ${item.name}`}
                    testID={`dependent-remove-${item.id}`}
                >
                    <RemoveButtonText>{t('settings.dependents.remove')}</RemoveButtonText>
                </RemoveButton>
            </ButtonRow>
        </Card>
    );

    const renderEmpty = (): React.ReactElement | null => (
        <EmptyContainer>
            <EmptyText>{t('settings.dependents.empty')}</EmptyText>
        </EmptyContainer>
    );

    if (isLoading) {
        return (
            <Container>
                <Header>
                    <Title>{t('settings.dependents.title')}</Title>
                </Header>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} testID="dependents-loading">
                    <ActivityIndicator size="large" />
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Title>{t('settings.dependents.title')}</Title>
            </Header>
            <FlatList
                data={dependents}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: spacingValues['4xl'],
                    flexGrow: dependents.length === 0 ? 1 : undefined,
                }}
            />
            <AddButton
                onPress={handleAdd}
                accessibilityRole="button"
                accessibilityLabel={t('settings.dependents.addDependent')}
                testID="dependents-add-button"
            >
                <AddButtonText>{t('settings.dependents.addDependent')}</AddButtonText>
            </AddButton>
        </Container>
    );
};

export default DependentsScreen;
