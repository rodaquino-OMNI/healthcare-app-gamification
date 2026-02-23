import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Card } from '@austa/design-system/src/components/Card/Card';
import { Badge } from '@austa/design-system/src/components/Badge/Badge';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { ROUTES } from '@constants/routes';
import { useTheme } from 'styled-components/native';
import type { Theme } from '@design-system/themes/base.theme';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

type AsyncDoctorChatRouteParams = {
  appointmentId: string;
  doctorName: string;
  doctorSpecialty: string;
};

type MessageSender = 'doctor' | 'patient' | 'system';

interface ChatMessage {
  id: string;
  sender: MessageSender;
  senderName: string;
  text: string;
  timestamp: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    sender: 'system',
    senderName: 'Sistema',
    text: 'Consulta encerrada ha 2 horas',
    timestamp: '12:30',
  },
  {
    id: 'msg-002',
    sender: 'doctor',
    senderName: 'Dra. Ana',
    text: 'Ola! Como voce esta se sentindo apos a consulta? Lembre-se de tomar o medicamento conforme orientado.',
    timestamp: '12:35',
  },
  {
    id: 'msg-003',
    sender: 'patient',
    senderName: 'Voce',
    text: 'Obrigado, Dra. Ana! Estou me sentindo melhor. Ja comecei a tomar o medicamento.',
    timestamp: '13:10',
  },
  {
    id: 'msg-004',
    sender: 'doctor',
    senderName: 'Dra. Ana',
    text: 'Otimo! Se sentir qualquer efeito colateral, entre em contato. Vamos agendar o retorno em 15 dias.',
    timestamp: '13:45',
  },
  {
    id: 'msg-005',
    sender: 'patient',
    senderName: 'Voce',
    text: 'Perfeito! Posso enviar os resultados dos exames por aqui?',
    timestamp: '14:00',
  },
  {
    id: 'msg-006',
    sender: 'doctor',
    senderName: 'Dra. Ana',
    text: 'Sim, pode enviar! Vou analisar e te retorno assim que possivel.',
    timestamp: '14:15',
  },
];

/**
 * AsyncDoctorChat screen provides an asynchronous text-based
 * communication channel between patient and doctor, typically
 * used for post-visit follow-up messages.
 */
const AsyncDoctorChat: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: AsyncDoctorChatRouteParams }, 'params'>>();
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const styles = createStyles(theme);
  const flatListRef = useRef<FlatList>(null);

  const { appointmentId, doctorName, doctorSpecialty } = route.params || {
    appointmentId: 'appt-001',
    doctorName: 'Dra. Ana Carolina Silva',
    doctorSpecialty: 'Cardiologia',
  };

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isOnline] = useState(false);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      senderName: t('journeys.care.asyncChat.you'),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText, t]);

  const handleAttachFile = useCallback(() => {
    // Mock: would open file picker
  }, []);

  const handleTakePhoto = useCallback(() => {
    // Mock: would open camera
  }, []);

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      if (item.sender === 'system') {
        return (
          <View style={styles.systemMessageContainer} testID={`system-msg-${item.id}`}>
            <Text
              fontSize="text-sm"
              color={colors.neutral.gray500}
              textAlign="center"
            >
              {item.text}
            </Text>
          </View>
        );
      }

      const isDoctor = item.sender === 'doctor';

      return (
        <View
          style={[
            styles.messageBubbleContainer,
            isDoctor ? styles.messageBubbleLeft : styles.messageBubbleRight,
          ]}
          testID={`chat-msg-${item.id}`}
          accessibilityLabel={`${item.senderName}: ${item.text}`}
        >
          {isDoctor && (
            <View style={styles.avatarPlaceholder}>
              <Text fontSize="text-sm" fontWeight="bold" color={colors.neutral.white}>
                {item.senderName.charAt(0)}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isDoctor ? styles.doctorBubble : styles.patientBubble,
            ]}
          >
            <Text
              fontSize="text-sm"
              fontWeight="semiBold"
              color={isDoctor ? colors.journeys.care.primary : colors.neutral.gray700}
            >
              {item.senderName}
            </Text>
            <Text
              fontSize="text-sm"
              color={isDoctor ? colors.journeys.care.text : colors.neutral.gray700}
            >
              {item.text}
            </Text>
            <Text
              fontSize="text-sm"
              color={colors.neutral.gray500}
              textAlign="right"
            >
              {item.timestamp}
            </Text>
          </View>
          {!isDoctor && (
            <View style={styles.avatarPlaceholderPatient}>
              <Text fontSize="text-sm" fontWeight="bold" color={colors.neutral.white}>
                {t('journeys.care.asyncChat.you').charAt(0)}
              </Text>
            </View>
          )}
        </View>
      );
    },
    [t],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* Doctor Info Header */}
      <View style={styles.headerContainer}>
        <View style={styles.doctorHeaderInfo}>
          <View style={styles.doctorAvatar}>
            <Text fontSize="md" fontWeight="bold" color={colors.neutral.white}>
              {doctorName.charAt(0)}
            </Text>
          </View>
          <View style={styles.doctorTextInfo}>
            <Text
              fontSize="md"
              fontWeight="semiBold"
              journey="care"
              testID="chat-doctor-name"
            >
              {doctorName}
            </Text>
            <Text fontSize="text-sm" color={colors.neutral.gray600} testID="chat-doctor-specialty">
              {doctorSpecialty}
            </Text>
          </View>
          <Badge
            variant="status"
            status={isOnline ? 'success' : 'neutral'}
            testID="online-status-badge"
            accessibilityLabel={
              isOnline
                ? t('journeys.care.asyncChat.online')
                : t('journeys.care.asyncChat.offline')
            }
          >
            {isOnline
              ? t('journeys.care.asyncChat.online')
              : t('journeys.care.asyncChat.offline')}
          </Badge>
        </View>
      </View>

      {/* Response Time Notice */}
      <View style={styles.noticeContainer}>
        <Text
          fontSize="text-sm"
          color={colors.neutral.gray600}
          textAlign="center"
          testID="response-notice"
        >
          {t('journeys.care.asyncChat.responseNotice', { doctorName })}
        </Text>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        testID="message-list"
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Attachment Bar */}
      <View style={styles.attachmentBar}>
        <TouchableOpacity
          onPress={handleAttachFile}
          style={styles.attachButton}
          testID="attach-file-button"
          accessibilityLabel={t('journeys.care.asyncChat.attachFile')}
          accessibilityRole="button"
        >
          <Text fontSize="text-sm" color={colors.journeys.care.primary}>
            {t('journeys.care.asyncChat.attachFile')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleTakePhoto}
          style={styles.attachButton}
          testID="take-photo-button"
          accessibilityLabel={t('journeys.care.asyncChat.takePhoto')}
          accessibilityRole="button"
        >
          <Text fontSize="text-sm" color={colors.journeys.care.primary}>
            {t('journeys.care.asyncChat.takePhoto')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('journeys.care.asyncChat.placeholder')}
          placeholderTextColor={colors.neutral.gray500}
          multiline
          maxLength={2000}
          testID="chat-text-input"
          accessibilityLabel={t('journeys.care.asyncChat.placeholder')}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!inputText.trim()}
          testID="send-button"
          accessibilityLabel={t('journeys.care.asyncChat.send')}
          accessibilityRole="button"
        >
          <Text
            fontSize="text-sm"
            fontWeight="bold"
            color={inputText.trim() ? colors.neutral.white : colors.neutral.gray400}
          >
            {t('journeys.care.asyncChat.send')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  headerContainer: {
    backgroundColor: theme.colors.background.default,
    padding: spacingValues.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  doctorHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingValues.sm,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.journeys.care.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorTextInfo: {
    flex: 1,
  },
  noticeContainer: {
    padding: spacingValues.sm,
    backgroundColor: colors.semantic.warningBg,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: spacingValues.sm,
    paddingBottom: spacingValues.md,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: spacingValues.sm,
    paddingHorizontal: spacingValues.md,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginVertical: spacingValues['3xs'],
    alignItems: 'flex-end',
    gap: spacingValues.xs,
  },
  messageBubbleLeft: {
    justifyContent: 'flex-start',
  },
  messageBubbleRight: {
    justifyContent: 'flex-end',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.journeys.care.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderPatient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral.gray600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: spacingValues.sm,
    borderRadius: spacingValues.sm,
    gap: spacingValues['4xs'],
  },
  doctorBubble: {
    backgroundColor: theme.colors.background.default,
    borderTopLeftRadius: spacingValues['4xs'],
  },
  patientBubble: {
    backgroundColor: colors.neutral.gray200,
    borderTopRightRadius: spacingValues['4xs'],
  },
  attachmentBar: {
    flexDirection: 'row',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    gap: spacingValues.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    backgroundColor: theme.colors.background.default,
  },
  attachButton: {
    paddingVertical: spacingValues['3xs'],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacingValues.sm,
    backgroundColor: theme.colors.background.default,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    gap: spacingValues.xs,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    borderRadius: spacingValues.lg,
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    fontSize: 14,
    color: colors.journeys.care.text,
    backgroundColor: theme.colors.background.subtle,
  },
  sendButton: {
    width: 56,
    height: 40,
    borderRadius: spacingValues.lg,
    backgroundColor: colors.journeys.care.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral.gray300,
  },
});

export { AsyncDoctorChat };
export default AsyncDoctorChat;
