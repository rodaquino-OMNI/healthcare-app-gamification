import React, { useState, useCallback } from 'react';
import { ScrollView, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Types ---

interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  lastSync: string;
  connected: boolean;
}

// --- Mock Data ---

const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: 'device-1',
    name: 'Apple Watch Series 9',
    type: 'Smartwatch',
    lastSync: 'Hoje, 14:30',
    connected: true,
  },
  {
    id: 'device-2',
    name: 'Fitbit Charge 5',
    type: 'Fitness Tracker',
    lastSync: 'Ontem, 08:15',
    connected: true,
  },
  {
    id: 'device-3',
    name: 'Garmin Venu 3',
    type: 'Smartwatch',
    lastSync: 'Nunca',
    connected: false,
  },
];

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['heading-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing['2xl']};
  padding-bottom: ${spacing.lg};
`;

const DeviceCard = styled.View`
  margin-horizontal: ${spacing.xl};
  margin-bottom: ${spacing.sm};
  padding: ${spacing.md};
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.lg};
  border-width: 1px;
  border-color: ${colors.gray[20]};
`;

const DeviceHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${spacing.xs};
`;

const StatusDot = styled.View<{ isConnected: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: ${borderRadius.full};
  background-color: ${({ isConnected }) =>
    isConnected ? colors.semantic.success : colors.gray[30]};
  margin-right: ${spacing.xs};
`;

const DeviceName = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
  flex: 1;
`;

const DeviceType = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[50]};
  margin-bottom: ${spacing['2xs']};
`;

const DeviceInfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${spacing.xs};
`;

const LastSyncText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.regular};
  color: ${colors.gray[40]};
`;

const StatusText = styled.Text<{ isConnected: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  font-weight: ${typography.fontWeight.medium};
  color: ${({ isConnected }) =>
    isConnected ? colors.semantic.success : colors.gray[40]};
`;

const UnpairButton = styled.TouchableOpacity`
  margin-top: ${spacing.sm};
  padding-vertical: ${spacing.xs};
  padding-horizontal: ${spacing.md};
  background-color: ${colors.semantic.errorBg};
  border-radius: ${borderRadius.md};
  align-self: flex-start;
`;

const UnpairButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.semantic.error};
`;

const PairButton = styled.TouchableOpacity`
  margin-horizontal: ${spacing.xl};
  margin-top: ${spacing.lg};
  height: ${sizing.component.lg};
  background-color: ${colors.brand.primary};
  border-radius: ${borderRadius.md};
  align-items: center;
  justify-content: center;
`;

const PairButtonText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.white};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${spacing['3xl']};
`;

const EmptyIcon = styled.Text`
  font-size: ${typography.fontSize['display-md']};
  color: ${colors.gray[30]};
  margin-bottom: ${spacing.md};
`;

const EmptyText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[50]};
  text-align: center;
`;

const ListFooter = styled.View`
  padding-bottom: ${spacing['4xl']};
`;

/**
 * ConnectedDevices screen -- manage paired wearables and fitness trackers.
 * Displays a list of devices with connection status, sync info,
 * and the ability to unpair or pair new devices.
 */
export const ConnectedDevicesScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [devices, setDevices] = useState<ConnectedDevice[]>(INITIAL_DEVICES);

  const handleUnpair = useCallback(
    (device: ConnectedDevice) => {
      Alert.alert(
        t('settings.connectedDevices.confirmUnpair'),
        device.name,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: t('settings.connectedDevices.unpair'),
            style: 'destructive',
            onPress: () => {
              setDevices((prev) => prev.filter((d) => d.id !== device.id));
            },
          },
        ],
      );
    },
    [t],
  );

  const handlePairNew = useCallback(() => {
    Alert.alert(
      t('settings.connectedDevices.pairNew'),
      'Bluetooth scanning...',
    );
  }, [t]);

  const renderDevice = useCallback(
    ({ item }: { item: ConnectedDevice }) => (
      <DeviceCard>
        <DeviceHeader>
          <StatusDot
            isConnected={item.connected}
            accessibilityLabel={
              item.connected
                ? t('settings.connectedDevices.connected')
                : t('settings.connectedDevices.disconnected')
            }
          />
          <DeviceName>{item.name}</DeviceName>
        </DeviceHeader>

        <DeviceType>{item.type}</DeviceType>

        <DeviceInfoRow>
          <LastSyncText>
            {t('settings.connectedDevices.lastSync')}: {item.lastSync}
          </LastSyncText>
          <StatusText isConnected={item.connected}>
            {item.connected
              ? t('settings.connectedDevices.connected')
              : t('settings.connectedDevices.disconnected')}
          </StatusText>
        </DeviceInfoRow>

        <UnpairButton
          onPress={() => handleUnpair(item)}
          accessibilityRole="button"
          accessibilityLabel={`${t('settings.connectedDevices.unpair')} ${item.name}`}
          testID={`device-unpair-${item.id}`}
        >
          <UnpairButtonText>
            {t('settings.connectedDevices.unpair')}
          </UnpairButtonText>
        </UnpairButton>
      </DeviceCard>
    ),
    [handleUnpair, t],
  );

  const renderEmpty = useCallback(
    () => (
      <EmptyContainer>
        <EmptyIcon accessibilityElementsHidden>---</EmptyIcon>
        <EmptyText>{t('settings.connectedDevices.empty')}</EmptyText>
      </EmptyContainer>
    ),
    [t],
  );

  return (
    <Container>
      <Title>{t('settings.connectedDevices.title')}</Title>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          <ListFooter>
            <PairButton
              onPress={handlePairNew}
              accessibilityRole="button"
              accessibilityLabel={t('settings.connectedDevices.pairNew')}
              testID="device-pair-new"
            >
              <PairButtonText>
                {t('settings.connectedDevices.pairNew')}
              </PairButtonText>
            </PairButton>
          </ListFooter>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
        testID="connected-devices-list"
      />
    </Container>
  );
};

export default ConnectedDevicesScreen;
