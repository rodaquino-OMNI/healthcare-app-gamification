import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { Button } from 'src/web/design-system/src/components/Button/Button';
import { Card } from 'src/web/design-system/src/components/Card/Card';
import { Badge } from 'src/web/design-system/src/components/Badge/Badge';
import { Avatar } from 'src/web/design-system/src/components/Avatar/Avatar';
import { Text } from 'src/web/design-system/src/primitives/Text/Text';
import { Box } from 'src/web/design-system/src/primitives/Box/Box';
import { JourneyHeader } from 'src/web/mobile/src/components/shared/JourneyHeader';
import { ROUTES } from 'src/web/mobile/src/constants/routes';
import { colors } from 'src/web/design-system/src/tokens/colors';
import { spacingValues } from 'src/web/design-system/src/tokens/spacing';

/**
 * Route parameters expected by DoctorProfile.
 */
type DoctorProfileRouteParams = {
  doctorId: string;
};

/**
 * Review data interface for displaying patient reviews.
 */
interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

/**
 * Full doctor detail interface with extended profile information.
 */
interface DoctorDetail {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  totalConsultations: string;
  yearsExperience: number;
  bio: string;
  specializations: string[];
  education: string[];
  certifications: string[];
  acceptedInsurance: string[];
  reviews: Review[];
}

/**
 * Mock doctor detail data.
 */
const MOCK_DOCTOR: DoctorDetail = {
  id: 'doc-001',
  name: 'Dra. Ana Carolina Silva',
  specialty: 'Cardiologia',
  rating: 4.9,
  totalConsultations: '2.3k',
  yearsExperience: 15,
  bio: 'Cardiologista com mais de 15 anos de experiencia, especializada em cardiologia preventiva e reabilitacao cardiaca. Membro da Sociedade Brasileira de Cardiologia (SBC) e pesquisadora ativa em novas terapias para insuficiencia cardiaca.',
  specializations: [
    'Cardiologia Preventiva',
    'Reabilitacao Cardiaca',
    'Ecocardiografia',
    'Arritmias',
  ],
  education: [
    'Medicina - Universidade de Sao Paulo (USP)',
    'Residencia em Cardiologia - InCor/HCFMUSP',
    'Mestrado em Ciencias Medicas - USP',
  ],
  certifications: [
    'Titulo de Especialista em Cardiologia - SBC',
    'Certificacao em Ecocardiografia - DIC/SBC',
    'BLS/ACLS - American Heart Association',
  ],
  acceptedInsurance: [
    'Unimed',
    'Bradesco Saude',
    'SulAmerica',
    'Amil',
    'Notre Dame Intermedica',
  ],
  reviews: [
    {
      id: 'rev-001',
      reviewerName: 'Maria L.',
      rating: 5,
      comment:
        'Excelente profissional, muito atenciosa e explicou tudo com clareza. Recomendo muito!',
      date: '15/01/2026',
    },
    {
      id: 'rev-002',
      reviewerName: 'Joao P.',
      rating: 5,
      comment:
        'Medica muito competente. Me senti acolhido durante toda a consulta.',
      date: '08/01/2026',
    },
    {
      id: 'rev-003',
      reviewerName: 'Carla S.',
      rating: 4,
      comment:
        'Otima consulta, mas a espera foi um pouco longa. Fora isso, tudo perfeito.',
      date: '22/12/2025',
    },
  ],
};

/**
 * Renders a star rating as text characters.
 */
const renderStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '\u2605'.repeat(fullStars) + (halfStar ? '\u2606' : '') + '\u2606'.repeat(emptyStars);
};

/**
 * DoctorProfile screen displays the full profile of a doctor including
 * stats, biography, specializations, reviews, education, certifications,
 * and accepted insurance plans.
 *
 * Part of the Care Now journey (orange theme).
 */
const DoctorProfile: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: DoctorProfileRouteParams }, 'params'>>();
  const { doctorId } = route.params || { doctorId: 'doc-001' };

  // In a real app, fetch doctor details by doctorId
  const doctor = MOCK_DOCTOR;

  /**
   * Navigates to the doctor availability/booking screen.
   */
  const handleBookAppointment = () => {
    navigation.navigate(ROUTES.CARE_DOCTOR_AVAILABILITY, { doctorId });
  };

  return (
    <View style={styles.root}>
      <JourneyHeader title="Perfil do Medico" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Doctor header section */}
        <View style={styles.headerSection}>
          <Avatar
            name={doctor.name}
            journey="care"
            size="96px"
            fallbackType="initials"
          />
          <Text
            fontWeight="bold"
            fontSize="xl"
            textAlign="center"
            testID="doctor-name"
          >
            {doctor.name}
          </Text>
          <Badge journey="care" size="md">
            {doctor.specialty}
          </Badge>
          <Text fontSize="md" color={colors.journeys.care.primary}>
            {renderStars(doctor.rating)} {doctor.rating}
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Card journey="care" elevation="sm" padding="sm">
            <View style={styles.statItem}>
              <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.primary}>
                {doctor.yearsExperience}
              </Text>
              <Text fontSize="sm" color={colors.neutral.gray700}>
                anos exp.
              </Text>
            </View>
          </Card>
          <Card journey="care" elevation="sm" padding="sm">
            <View style={styles.statItem}>
              <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.primary}>
                {doctor.rating}
              </Text>
              <Text fontSize="sm" color={colors.neutral.gray700}>
                avaliacao
              </Text>
            </View>
          </Card>
          <Card journey="care" elevation="sm" padding="sm">
            <View style={styles.statItem}>
              <Text fontWeight="bold" fontSize="lg" color={colors.journeys.care.primary}>
                {doctor.totalConsultations}
              </Text>
              <Text fontSize="sm" color={colors.neutral.gray700}>
                consultas
              </Text>
            </View>
          </Card>
        </View>

        {/* About section */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="lg" testID="about-heading">
            Sobre
          </Text>
          <Text fontSize="md" color={colors.neutral.gray700} testID="doctor-bio">
            {doctor.bio}
          </Text>
        </View>

        {/* Specializations */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="lg">
            Especializacoes
          </Text>
          <View style={styles.badgeList}>
            {doctor.specializations.map((spec) => (
              <Badge key={spec} journey="care" size="sm">
                {spec}
              </Badge>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="lg">
            Avaliacoes ({doctor.reviews.length})
          </Text>
          {doctor.reviews.map((review) => (
            <Card
              key={review.id}
              journey="care"
              elevation="sm"
              padding="md"
              accessibilityLabel={`Avaliacao de ${review.reviewerName}, ${review.rating} estrelas`}
            >
              <View style={styles.reviewHeader}>
                <Text fontWeight="medium" fontSize="md">
                  {review.reviewerName}
                </Text>
                <Text fontSize="sm" color={colors.journeys.care.primary}>
                  {renderStars(review.rating)}
                </Text>
              </View>
              <Text fontSize="sm" color={colors.neutral.gray700}>
                {review.comment}
              </Text>
              <Text fontSize="sm" color={colors.neutral.gray500}>
                {review.date}
              </Text>
            </Card>
          ))}
        </View>

        {/* Education & Certifications */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="lg">
            Formacao Academica
          </Text>
          {doctor.education.map((edu, index) => (
            <View key={index} style={styles.listItem}>
              <Text fontSize="sm" color={colors.neutral.gray700}>
                {edu}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="lg">
            Certificacoes
          </Text>
          {doctor.certifications.map((cert, index) => (
            <View key={index} style={styles.listItem}>
              <Text fontSize="sm" color={colors.neutral.gray700}>
                {cert}
              </Text>
            </View>
          ))}
        </View>

        {/* Accepted Insurance */}
        <View style={styles.section}>
          <Text fontWeight="medium" fontSize="lg">
            Convenios Aceitos
          </Text>
          <View style={styles.badgeList}>
            {doctor.acceptedInsurance.map((insurance) => (
              <Badge key={insurance} variant="status" status="info" size="sm">
                {insurance}
              </Badge>
            ))}
          </View>
        </View>

        {/* CTA button spacer to avoid overlap with fixed CTA */}
        <View style={styles.ctaSpacer} />
      </ScrollView>

      {/* Fixed bottom CTA */}
      <View style={styles.ctaContainer}>
        <Button
          variant="primary"
          journey="care"
          size="lg"
          onPress={handleBookAppointment}
          accessibilityLabel="Agendar consulta com este medico"
          testID="book-appointment-cta"
        >
          Agendar Consulta
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacingValues.md,
    paddingBottom: spacingValues['3xl'],
  },
  headerSection: {
    alignItems: 'center',
    gap: spacingValues.xs,
    marginBottom: spacingValues.xl,
    paddingTop: spacingValues.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacingValues.sm,
    marginBottom: spacingValues.xl,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  section: {
    marginBottom: spacingValues.xl,
    gap: spacingValues.sm,
  },
  badgeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingValues.xs,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingValues['3xs'],
  },
  listItem: {
    paddingVertical: spacingValues['3xs'],
    paddingLeft: spacingValues.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.journeys.care.primary,
  },
  ctaSpacer: {
    height: 80,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.journeys.care.background,
    padding: spacingValues.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
  },
});

export default DoctorProfile;
