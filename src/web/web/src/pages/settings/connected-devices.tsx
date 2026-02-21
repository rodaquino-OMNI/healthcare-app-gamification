import React, { useState } from 'react';
import type { NextPage } from 'next';
import { colors, typography, spacing, borderRadius } from '@web/design-system/src/tokens';

interface Device {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  lastSync: string;
  battery: number;
}

const MOCK_DEVICES: Device[] = [
  { id: '1', name: 'Apple Watch Series 9', type: 'Smartwatch', connected: true, lastSync: 'Agora', battery: 72 },
  { id: '2', name: 'Xiaomi Mi Band 8', type: 'Pulseira', connected: false, lastSync: 'Ha 2 dias', battery: 45 },
  { id: '3', name: 'Omron HEM-7120', type: 'Medidor de Pressao', connected: true, lastSync: 'Ha 3 horas', battery: 90 },
];

/**
 * Connected devices page.
 * Allows users to view and manage connected wearables and health devices.
 */
const ConnectedDevicesPage: NextPage = () => {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => d.id === id ? { ...d, connected: !d.connected } : d)
    );
  };

  const removeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div style={{ padding: spacing.xl, maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={titleStyle}>Dispositivos Conectados</h1>
      <p style={subtitleStyle}>Gerencie seus wearables e dispositivos de saude.</p>

      {devices.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center' as const }}>
          <p style={{ fontSize: typography.fontSize['text-md'], color: colors.gray[40], margin: 0 }}>
            Nenhum dispositivo conectado.
          </p>
        </div>
      ) : (
        devices.map((device) => (
          <div key={device.id} style={{ ...cardStyle, marginBottom: spacing.md }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={deviceNameStyle}>{device.name}</h3>
                <span style={deviceTypeStyle}>{device.type}</span>
              </div>
              <span style={{
                fontSize: typography.fontSize['text-xs'], fontWeight: typography.fontWeight.medium,
                color: device.connected ? colors.semantic.success : colors.gray[40],
                backgroundColor: device.connected ? colors.semantic.successBg : colors.gray[10],
                padding: `${spacing['3xs']} ${spacing.xs}`, borderRadius: borderRadius.full,
              }}>
                {device.connected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            <div style={detailsRowStyle}>
              <span style={detailLabelStyle}>Ultima sincronizacao:</span>
              <span style={detailValueStyle}>{device.lastSync}</span>
            </div>
            <div style={detailsRowStyle}>
              <span style={detailLabelStyle}>Bateria:</span>
              <span style={detailValueStyle}>{device.battery}%</span>
            </div>

            <div style={{ display: 'flex', gap: spacing.xs, marginTop: spacing.md }}>
              <button
                onClick={() => toggleDevice(device.id)}
                style={{
                  ...actionBtnStyle,
                  backgroundColor: device.connected ? colors.gray[10] : colors.brand.primary,
                  color: device.connected ? colors.gray[60] : colors.neutral.white,
                }}
              >
                {device.connected ? 'Desconectar' : 'Conectar'}
              </button>
              <button onClick={() => removeDevice(device.id)} style={removeBtnStyle}>
                Remover
              </button>
            </div>
          </div>
        ))
      )}

      <button style={addBtnStyle}>+ Adicionar Dispositivo</button>
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
  padding: spacing.lg, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
const deviceNameStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-md'], fontWeight: typography.fontWeight.semiBold,
  color: colors.gray[70], margin: 0, fontFamily: typography.fontFamily.body,
};
const deviceTypeStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-xs'], color: colors.gray[40], fontFamily: typography.fontFamily.body,
};
const detailsRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', marginTop: spacing.xs,
};
const detailLabelStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[50], fontFamily: typography.fontFamily.body,
};
const detailValueStyle: React.CSSProperties = {
  fontSize: typography.fontSize['text-sm'], color: colors.gray[70],
  fontWeight: typography.fontWeight.medium, fontFamily: typography.fontFamily.body,
};
const actionBtnStyle: React.CSSProperties = {
  flex: 1, padding: spacing.xs, border: 'none', borderRadius: borderRadius.md, cursor: 'pointer',
  fontSize: typography.fontSize['text-sm'], fontWeight: typography.fontWeight.medium,
  fontFamily: typography.fontFamily.body,
};
const removeBtnStyle: React.CSSProperties = {
  padding: `${spacing.xs} ${spacing.md}`, backgroundColor: 'transparent',
  color: colors.semantic.error, border: `1px solid ${colors.semantic.error}`,
  borderRadius: borderRadius.md, cursor: 'pointer', fontSize: typography.fontSize['text-sm'],
  fontFamily: typography.fontFamily.body,
};
const addBtnStyle: React.CSSProperties = {
  width: '100%', padding: spacing.sm, backgroundColor: colors.gray[0],
  color: colors.brand.primary, border: `2px dashed ${colors.brand.primary}`,
  borderRadius: borderRadius.md, cursor: 'pointer', fontSize: typography.fontSize['text-md'],
  fontWeight: typography.fontWeight.medium, fontFamily: typography.fontFamily.body,
  marginTop: spacing.md,
};

export default ConnectedDevicesPage;
