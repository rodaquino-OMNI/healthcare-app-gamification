import React, { useState, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { colors } from '../../../../design-system/src/tokens/colors';
import { typography } from '../../../../design-system/src/tokens/typography';
import { spacing, spacingValues } from '../../../../design-system/src/tokens/spacing';
import { borderRadius } from '../../../../design-system/src/tokens/borderRadius';
import { sizing } from '../../../../design-system/src/tokens/sizing';

// --- Styled Components ---

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.md};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray[10]};
`;

const HeaderTitleContainer = styled.View`
  flex: 1;
`;

const HeaderTitle = styled.Text`
  font-family: ${typography.fontFamily.heading};
  font-size: ${typography.fontSize['text-lg']};
  font-weight: ${typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.default};
`;

const HeaderStatus = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

const StatusDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colors.semantic.success};
  margin-right: ${spacing.xs};
`;

const StatusText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${colors.semantic.success};
  font-weight: ${typography.fontWeight.medium};
`;

const MessagesContainer = styled.View`
  flex: 1;
  padding-horizontal: ${spacing.xl};
`;

const MessageBubble = styled.View<{ isUser: boolean }>`
  max-width: 80%;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  border-radius: ${borderRadius.lg};
  margin-vertical: ${spacing.xs};
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) =>
    props.isUser ? colors.brand.primary : colors.gray[10]};
`;

const MessageText = styled.Text<{ isUser: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  font-weight: ${typography.fontWeight.regular};
  color: ${(props) =>
    props.isUser ? colors.neutral.white : colors.neutral.gray900};
  line-height: 22px;
`;

const MessageTime = styled.Text<{ isUser: boolean }>`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${(props) =>
    props.isUser ? 'rgba(255,255,255,0.7)' : colors.gray[40]};
  margin-top: 2px;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const TypingIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.xs};
`;

const TypingDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.text.subtle};
  margin-right: 4px;
`;

const TypingText = styled.Text`
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-xs']};
  color: ${({ theme }) => theme.colors.text.subtle};
  font-style: italic;
  margin-left: ${spacing.xs};
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${spacing.xl};
  padding-vertical: ${spacing.sm};
  border-top-width: 1px;
  border-top-color: ${colors.gray[10]};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const TextInputStyled = styled.TextInput`
  flex: 1;
  min-height: ${sizing.component.sm};
  max-height: 100px;
  background-color: ${({ theme }) => theme.colors.background.subtle};
  border-radius: ${borderRadius.lg};
  padding-horizontal: ${spacing.md};
  padding-vertical: ${spacing.sm};
  font-family: ${typography.fontFamily.body};
  font-size: ${typography.fontSize['text-md']};
  color: ${({ theme }) => theme.colors.text.default};
  margin-right: ${spacing.sm};
`;

const SendButton = styled.TouchableOpacity<{ disabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.disabled ? colors.gray[20] : colors.brand.primary};
  align-items: center;
  justify-content: center;
`;

const SendButtonText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.onBrand};
`;

// --- Types ---

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
}

// --- Mock Data ---

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Ola! Como posso ajudar?',
    sender: 'support',
    time: '14:00',
  },
  {
    id: '2',
    text: 'Preciso de ajuda com meu plano',
    sender: 'user',
    time: '14:01',
  },
  {
    id: '3',
    text: 'Claro! Qual e a sua duvida sobre o plano?',
    sender: 'support',
    time: '14:02',
  },
];

// --- Component ---

export const LiveChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const getCurrentTime = (): string => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const userMessage: ChatMessage = {
      id: String(Date.now()),
      text: inputText.trim(),
      sender: 'user',
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate support typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const supportMessage: ChatMessage = {
        id: String(Date.now() + 1),
        text: 'Obrigado pela sua mensagem. Um atendente ira responder em breve.',
        sender: 'support',
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, supportMessage]);
    }, 2000);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';
    return (
      <MessageBubble
        isUser={isUser}
        accessibilityRole="text"
        accessibilityLabel={`${isUser ? 'Voce' : 'Suporte'}: ${item.text}`}
        testID={`chat-message-${item.id}`}
      >
        <MessageText isUser={isUser}>{item.text}</MessageText>
        <MessageTime isUser={isUser}>{item.time}</MessageTime>
      </MessageBubble>
    );
  };

  const isSendDisabled = inputText.trim().length === 0;

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Header>
          <HeaderTitleContainer>
            <HeaderTitle
              accessibilityRole="header"
              testID="live-chat-title"
            >
              {t('help.chat.title')}
            </HeaderTitle>
            <HeaderStatus>
              <StatusDot />
              <StatusText>{t('help.chat.online')}</StatusText>
            </HeaderStatus>
          </HeaderTitleContainer>
        </Header>

        <MessagesContainer>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingVertical: spacingValues.md,
            }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
            testID="chat-messages-list"
          />

          {isTyping && (
            <TypingIndicator testID="chat-typing-indicator">
              <TypingDot />
              <TypingDot />
              <TypingDot />
              <TypingText>{t('help.chat.typing')}</TypingText>
            </TypingIndicator>
          )}
        </MessagesContainer>

        <InputContainer>
          <TextInputStyled
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('help.chat.placeholder')}
            placeholderTextColor={colors.gray[40]}
            multiline
            accessibilityLabel={t('help.chat.placeholder')}
            testID="chat-input"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <SendButton
            onPress={handleSend}
            disabled={isSendDisabled}
            accessibilityRole="button"
            accessibilityLabel={t('help.chat.send')}
            testID="chat-send-button"
          >
            <SendButtonText>{'\u{27A4}'}</SendButtonText>
          </SendButton>
        </InputContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default LiveChatScreen;
