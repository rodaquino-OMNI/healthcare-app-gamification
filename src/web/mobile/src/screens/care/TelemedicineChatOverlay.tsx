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
import { Button } from '@austa/design-system/src/components/Button/Button';
import { Text } from '@austa/design-system/src/primitives/Text/Text';
import { colors } from '@austa/design-system/src/tokens/colors';
import { spacingValues } from '@austa/design-system/src/tokens/spacing';

/**
 * Route params expected by TelemedicineChatOverlay.
 */
type TelemedicineChatOverlayRouteParams = {
  appointmentId: string;
  doctorName: string;
};

/**
 * Represents a single chat message.
 */
interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  senderName: string;
  text: string;
  timestamp: string;
}

/**
 * Returns current time as HH:MM string.
 */
const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

/**
 * Creates initial mock messages for the chat.
 */
const createMockMessages = (doctorName: string): ChatMessage[] => [
  {
    id: '1',
    sender: 'doctor',
    senderName: doctorName,
    text: 'Hello! I can see your file. How are you feeling today?',
    timestamp: '14:30',
  },
  {
    id: '2',
    sender: 'patient',
    senderName: 'You',
    text: 'Hi doctor, I have been having headaches for the past 3 days.',
    timestamp: '14:31',
  },
  {
    id: '3',
    sender: 'doctor',
    senderName: doctorName,
    text: 'I understand. Can you describe the type of pain? Is it sharp, dull, or throbbing?',
    timestamp: '14:32',
  },
];

/**
 * Quick reply options for the chat.
 */
const QUICK_REPLIES = [
  'yes',
  'no',
  'iUnderstand',
  'canYouRepeat',
] as const;

/**
 * TelemedicineChatOverlay provides an in-call text chat with the doctor.
 * Displays a scrollable message list, quick reply chips, and a text input
 * for composing messages.
 */
const TelemedicineChatOverlay: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: TelemedicineChatOverlayRouteParams }, 'params'>>();
  const { t } = useTranslation();

  const { doctorName = '' } = route.params || {};

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createMockMessages(doctorName),
  );
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  let nextId = useRef(messages.length + 1);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const addMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const newMessage: ChatMessage = {
        id: String(nextId.current++),
        sender: 'patient',
        senderName: t('journeys.care.telemedicineDeep.chat.you'),
        text: text.trim(),
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    [t],
  );

  const handleSend = useCallback(() => {
    addMessage(inputText);
  }, [addMessage, inputText]);

  const handleQuickReply = useCallback(
    (replyKey: string) => {
      const replyText = t(`journeys.care.telemedicineDeep.chat.quickReplies.${replyKey}`);
      addMessage(replyText);
    },
    [addMessage, t],
  );

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isDoctor = item.sender === 'doctor';
      return (
        <View
          style={[
            styles.messageBubbleContainer,
            isDoctor ? styles.messageBubbleLeft : styles.messageBubbleRight,
          ]}
          testID={`chat-message-${item.id}`}
        >
          <Text
            fontSize="text-sm"
            fontWeight="semiBold"
            color={isDoctor ? colors.journeys.care.primary : colors.neutral.gray700}
            testID={`message-sender-${item.id}`}
          >
            {item.senderName}
          </Text>
          <View
            style={[
              styles.bubble,
              isDoctor ? styles.bubbleDoctor : styles.bubblePatient,
            ]}
          >
            <Text
              variant="body"
              color={isDoctor ? colors.neutral.gray800 : colors.neutral.white}
            >
              {item.text}
            </Text>
          </View>
          <Text
            fontSize="text-sm"
            color={colors.neutral.gray500}
            testID={`message-time-${item.id}`}
          >
            {item.timestamp}
          </Text>
        </View>
      );
    },
    [],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="telemedicine-chat-overlay"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          variant="heading"
          journey="care"
          testID="chat-header-title"
        >
          {t('journeys.care.telemedicineDeep.chat.title')}
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          testID="close-chat-button"
          accessibilityLabel={t('journeys.care.telemedicineDeep.chat.close')}
          accessibilityRole="button"
        >
          <Text fontSize="heading-sm" color={colors.journeys.care.text}>
            {'\u2715'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        testID="chat-message-list"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Quick replies */}
      <View style={styles.quickReplies}>
        {QUICK_REPLIES.map((replyKey) => (
          <TouchableOpacity
            key={replyKey}
            style={styles.quickReplyChip}
            onPress={() => handleQuickReply(replyKey)}
            testID={`quick-reply-${replyKey}`}
            accessibilityLabel={t(`journeys.care.telemedicineDeep.chat.quickReplies.${replyKey}`)}
            accessibilityRole="button"
          >
            <Text fontSize="text-sm" color={colors.journeys.care.primary}>
              {t(`journeys.care.telemedicineDeep.chat.quickReplies.${replyKey}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('journeys.care.telemedicineDeep.chat.inputPlaceholder')}
          placeholderTextColor={colors.neutral.gray500}
          multiline
          maxLength={500}
          testID="chat-text-input"
          accessibilityLabel={t('journeys.care.telemedicineDeep.chat.inputPlaceholder')}
        />
        <Button
          onPress={handleSend}
          journey="care"
          accessibilityLabel={t('journeys.care.telemedicineDeep.chat.send')}
          testID="send-message-button"
        >
          {t('journeys.care.telemedicineDeep.chat.send')}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.journeys.care.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray200,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: spacingValues.md,
    gap: spacingValues.sm,
  },
  messageBubbleContainer: {
    maxWidth: '80%',
    gap: spacingValues['4xs'],
  },
  messageBubbleLeft: {
    alignSelf: 'flex-start',
  },
  messageBubbleRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    borderRadius: spacingValues.sm,
  },
  bubbleDoctor: {
    backgroundColor: colors.neutral.gray200,
    borderTopLeftRadius: spacingValues['3xs'],
  },
  bubblePatient: {
    backgroundColor: colors.journeys.care.primary,
    borderTopRightRadius: spacingValues['3xs'],
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    gap: spacingValues.xs,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
  },
  quickReplyChip: {
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues['2xs'],
    borderRadius: spacingValues.md,
    borderWidth: 1,
    borderColor: colors.journeys.care.primary,
    backgroundColor: colors.neutral.white,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacingValues.md,
    paddingVertical: spacingValues.xs,
    gap: spacingValues.xs,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.white,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: spacingValues.lg,
    paddingHorizontal: spacingValues.sm,
    paddingVertical: spacingValues.xs,
    fontSize: 14,
    color: colors.journeys.care.text,
    backgroundColor: colors.neutral.gray100,
  },
});

export { TelemedicineChatOverlay };
export default TelemedicineChatOverlay;
