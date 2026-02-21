import React from 'react';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacing } from 'src/web/design-system/src/tokens/spacing';

interface StepProps {
  data: Record<string, any>;
  onUpdate: (field: string, value: any) => void;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const BLOOD_TYPE_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: spacing.sm,
  border: `1px solid ${colors.neutral.gray300}`,
  borderRadius: 8,
  fontSize: 14,
  color: colors.neutral.gray900,
  backgroundColor: colors.neutral.white,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  marginBottom: spacing['3xs'],
  display: 'block',
};

const StepPersonalInfoPage: React.FC<StepProps> = ({ data, onUpdate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <Text fontSize="lg" fontWeight="bold" color={colors.journeys.health.text}>
        Personal Information
      </Text>
      <Text fontSize="sm" color={colors.gray[50]}>
        Basic details help us personalize your health assessment.
      </Text>

      <Card journey="health" elevation="sm" padding="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <div>
            <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
              Full Name
            </Text>
            <input
              style={inputStyle}
              type="text"
              placeholder="Enter your full name"
              value={data.fullName || ''}
              onChange={(e) => onUpdate('fullName', e.target.value)}
              aria-label="Full name"
            />
          </div>

          <div>
            <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
              Date of Birth
            </Text>
            <input
              style={inputStyle}
              type="date"
              value={data.dateOfBirth || ''}
              onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
              aria-label="Date of birth"
            />
          </div>

          <div>
            <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
              Gender
            </Text>
            <select
              style={inputStyle}
              value={data.gender || ''}
              onChange={(e) => onUpdate('gender', e.target.value)}
              aria-label="Gender"
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <Text fontSize="sm" fontWeight="medium" color={colors.gray[60]} style={labelStyle}>
              Blood Type
            </Text>
            <select
              style={inputStyle}
              value={data.bloodType || ''}
              onChange={(e) => onUpdate('bloodType', e.target.value)}
              aria-label="Blood type"
            >
              <option value="">Select blood type</option>
              {BLOOD_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StepPersonalInfoPage;
