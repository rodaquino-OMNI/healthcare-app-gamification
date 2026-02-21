import React, { useState } from 'react';
import { ScrollView, TextInput as RNTextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.neutral.white};
`;

const Header = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.xl};
  padding-bottom: ${spacing.md};
`;

const Title = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.gray900};
  margin-bottom: ${spacing.lg};
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.gray[10]};
  border-radius: ${borderRadius.lg};
  padding-horizontal: ${spacing.md};
  height: ${sizing.component.md};
`;

const SearchIcon = styled.Text`
  font-size: ${typography.fontSize['text-lg']};
  color: ${colors.gray[40]};
  margin-right: ${spacing.sm};
`;

const SearchInput = styled(RNTextInput)`
  flex: 1;
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.neutral.gray900};
  padding-vertical: 0;
`;

const CategoriesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.lg};
`;

const CategoryCard = styled.TouchableOpacity`
  width: 48%;
  margin-bottom: ${spacing.md};
  margin-right: 4%;
  background-color: ${colors.neutral.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  border-width: 1px;
  border-color: ${colors.gray[10]};
  shadow-color: ${colors.neutral.black};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const CategoryIconContainer = styled.View<{ bgColor: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${borderRadius.md};
  background-color: ${(props) => props.bgColor};
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.sm};
`;

const CategoryIconText = styled.Text`
  font-size: ${typography.fontSize['text-xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.neutral.white};
`;

const CategoryTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.neutral.gray900};
  margin-bottom: 2px;
`;

const CategorySubtitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.gray[50]};
`;

const QuickLinksSection = styled.View`
  padding-horizontal: ${spacing.xl};
  padding-top: ${spacing.xl};
  padding-bottom: ${spacing.lg};
`;

const QuickLinksTitle = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-sm']};
  font-weight: ${typography.fontWeight.semiBold};
  color: ${colors.gray[50]};
  text-transform: uppercase;
  letter-spacing: ${typography.letterSpacing.wide};
  margin-bottom: ${spacing.md};
`;

const QuickLinkRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${spacing.sm};
`;

const QuickLinkText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${colors.brand.primary};
  margin-left: ${spacing.sm};
`;

// --- Types ---

interface CategoryItem {
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  route: string;
}

// --- Component ---

export const HelpHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories: CategoryItem[] = [
    {
      title: t('help.home.categories.faq'),
      subtitle: t('help.faq.title'),
      icon: '?',
      bgColor: colors.brand.primary,
      route: ROUTES.HELP_FAQ_CATEGORY,
    },
    {
      title: t('help.home.categories.contact'),
      subtitle: t('help.contact.title'),
      icon: '\u260E',
      bgColor: colors.journeys.care.primary,
      route: ROUTES.HELP_CONTACT,
    },
    {
      title: t('help.home.categories.report'),
      subtitle: t('help.report.title'),
      icon: '!',
      bgColor: colors.semantic.warning,
      route: ROUTES.HELP_REPORT,
    },
    {
      title: t('help.home.categories.terms'),
      subtitle: t('settings.terms.title'),
      icon: '\u2261',
      bgColor: colors.gray[50],
      route: ROUTES.SETTINGS_TERMS,
    },
    {
      title: t('help.home.categories.privacy'),
      subtitle: t('settings.privacyPolicy.title'),
      icon: '\u26BF',
      bgColor: colors.journeys.plan.primary,
      route: ROUTES.SETTINGS_PRIVACY_POLICY,
    },
    {
      title: t('help.home.categories.about'),
      subtitle: t('settings.aboutApp.title'),
      icon: 'i',
      bgColor: colors.journeys.health.primary,
      route: ROUTES.SETTINGS_ABOUT,
    },
  ];

  const handleCategoryPress = (route: string) => {
    navigation.navigate(route as never);
  };

  const handleQuickLink = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacingValues['4xl'] }}
      >
        <Header>
          <Title accessibilityRole="header" testID="help-home-title">
            {t('help.home.title')}
          </Title>

          <SearchContainer>
            <SearchIcon accessibilityElementsHidden>
              {'\u{1F50D}'}
            </SearchIcon>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('help.home.searchPlaceholder')}
              placeholderTextColor={colors.gray[40]}
              accessibilityLabel={t('help.home.search')}
              testID="help-home-search"
              returnKeyType="search"
            />
          </SearchContainer>
        </Header>

        <CategoriesGrid>
          {categories.map((category, index) => (
            <CategoryCard
              key={category.route}
              onPress={() => handleCategoryPress(category.route)}
              accessibilityRole="button"
              accessibilityLabel={category.title}
              testID={`help-category-${index}`}
              style={index % 2 === 1 ? { marginRight: 0 } : undefined}
            >
              <CategoryIconContainer bgColor={category.bgColor}>
                <CategoryIconText>{category.icon}</CategoryIconText>
              </CategoryIconContainer>
              <CategoryTitle numberOfLines={2}>{category.title}</CategoryTitle>
              <CategorySubtitle numberOfLines={1}>
                {category.subtitle}
              </CategorySubtitle>
            </CategoryCard>
          ))}
        </CategoriesGrid>

        <QuickLinksSection>
          <QuickLinksTitle>{t('help.home.quickLinks')}</QuickLinksTitle>
          <QuickLinkRow
            onPress={() => handleQuickLink(ROUTES.HELP_FAQ_CATEGORY)}
            accessibilityRole="link"
            accessibilityLabel={t('help.home.categories.faq')}
            testID="help-quick-faq"
          >
            <QuickLinkText>{t('help.home.categories.faq')}</QuickLinkText>
          </QuickLinkRow>
          <QuickLinkRow
            onPress={() => handleQuickLink(ROUTES.HELP_CONTACT)}
            accessibilityRole="link"
            accessibilityLabel={t('help.home.categories.contact')}
            testID="help-quick-contact"
          >
            <QuickLinkText>{t('help.home.categories.contact')}</QuickLinkText>
          </QuickLinkRow>
          <QuickLinkRow
            onPress={() => handleQuickLink(ROUTES.HELP_REPORT)}
            accessibilityRole="link"
            accessibilityLabel={t('help.home.categories.report')}
            testID="help-quick-report"
          >
            <QuickLinkText>{t('help.home.categories.report')}</QuickLinkText>
          </QuickLinkRow>
        </QuickLinksSection>
      </ScrollView>
    </Container>
  );
};

export default HelpHomeScreen;
