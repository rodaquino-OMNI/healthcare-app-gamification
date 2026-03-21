import type { Theme } from '@design-system/themes/base.theme';
import { borderRadiusValues } from '@design-system/tokens/borderRadius';
import { colors } from '@design-system/tokens/colors';
import { spacingValues } from '@design-system/tokens/spacing';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import { useTheme } from 'styled-components/native';

import { ROUTES } from '../../constants/routes';
import type { WellnessNavigationProp } from '../../navigation/types';

/**
 * Represents a single chat message.
 */
interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

/**
 * Mock message data for development.
 */
const MOCK_MESSAGES: ChatMessage[] = [
    {
        id: 'msg-001',
        text: 'journeys.health.wellness.chatActive.aiGreeting',
        sender: 'ai',
        timestamp: '10:00',
    },
    {
        id: 'msg-002',
        text: 'journeys.health.wellness.chatActive.userFeeling',
        sender: 'user',
        timestamp: '10:01',
    },
    {
        id: 'msg-003',
        text: 'journeys.health.wellness.chatActive.aiResponse1',
        sender: 'ai',
        timestamp: '10:01',
    },
    {
        id: 'msg-004',
        text: 'journeys.health.wellness.chatActive.userStress',
        sender: 'user',
        timestamp: '10:02',
    },
    {
        id: 'msg-005',
        text: 'journeys.health.wellness.chatActive.aiBreathingSuggestion',
        sender: 'ai',
        timestamp: '10:03',
    },
    {
        id: 'msg-006',
        text: 'journeys.health.wellness.chatActive.userThanks',
        sender: 'user',
        timestamp: '10:04',
    },
    {
        id: 'msg-007',
        text: 'journeys.health.wellness.chatActive.aiEncouragement',
        sender: 'ai',
        timestamp: '10:04',
    },
];

/**
 * TypingIndicator shows three animated dots to simulate AI typing.
 */
const TypingIndicator: React.FC<{ theme: Theme }> = ({ theme }) => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
    const indicatorStyles = createStyles(theme);

    useEffect(() => {
        const animateDot = (dot: Animated.Value, delay: number) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );

        const a1 = animateDot(dot1, 0);
        const a2 = animateDot(dot2, 150);
        const a3 = animateDot(dot3, 300);
        a1.start();
        a2.start();
        a3.start();

        return () => {
            a1.stop();
            a2.stop();
            a3.stop();
        };
    }, [dot1, dot2, dot3]);

    const dots = [dot1, dot2, dot3];

    return (
        <View style={indicatorStyles.typingContainer}>
            <View style={indicatorStyles.typingBubble}>
                {dots.map((dot, index) => (
                    <Animated.View
                        key={`dot-${index}`}
                        style={[
                            indicatorStyles.typingDot,
                            { opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

/**
 * CompanionChatActiveScreen displays the active chat conversation
 * with message bubbles, typing indicator, and text input.
 */
export const CompanionChatActiveScreen: React.FC = () => {
    const navigation = useNavigation<WellnessNavigationProp>();
    const { t } = useTranslation();
    const theme = useTheme() as Theme;
    const styles = createStyles(theme);
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList<ChatMessage>>(null);

    const handleSend = useCallback(() => {
        if (!inputText.trim()) {
            return;
        }

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    id: `msg-ai-${Date.now()}`,
                    text: 'journeys.health.wellness.chatActive.aiGenericResponse',
                    sender: 'ai',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        }, 2000);
    }, [inputText]);

    const handleQuickReplies = useCallback(() => {
        navigation.navigate(ROUTES.WELLNESS_QUICK_REPLIES as 'WellnessQuickReplies');
    }, [navigation]);

    const renderMessage = ({ item }: { item: ChatMessage }): React.ReactElement | null => {
        const isUser = item.sender === 'user';
        return (
            <View
                style={[styles.messageBubbleRow, isUser ? styles.messageRowUser : styles.messageRowAi]}
                testID={`message-${item.id}`}
            >
                {!isUser && (
                    <View style={styles.aiAvatarSmall}>
                        <Text style={styles.aiAvatarEmoji}>{'\u{1F9D8}'}</Text>
                    </View>
                )}
                <View style={[styles.messageBubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
                    <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAi]}>
                        {item.sender === 'ai' ? t(item.text) : item.text}
                    </Text>
                    <Text style={[styles.messageTime, isUser ? styles.timeUser : styles.timeAi]}>{item.timestamp}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} testID="wellness-chat-active-screen">
            <View style={styles.headerBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityLabel={t('common.buttons.back')}
                >
                    <Text style={styles.backArrow}>{'\u2190'}</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.headerAvatarEmoji}>{'\u{1F9D8}'}</Text>
                    <Text style={styles.screenTitle}>{t('journeys.health.wellness.chatActive.screenTitle')}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    testID="messages-list"
                />

                {isTyping && <TypingIndicator theme={theme} />}

                <View style={styles.inputBar}>
                    <TouchableOpacity
                        style={styles.quickReplyButton}
                        onPress={handleQuickReplies}
                        accessibilityLabel={t('journeys.health.wellness.chatActive.quickRepliesLabel')}
                        accessibilityRole="button"
                        testID="quick-replies-button"
                    >
                        <Text style={styles.quickReplyIcon}>{'\u2726'}</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={t('journeys.health.wellness.chatActive.inputPlaceholder')}
                        placeholderTextColor={theme.colors.text.muted}
                        multiline
                        maxLength={500}
                        testID="chat-input"
                        accessibilityLabel={t('journeys.health.wellness.chatActive.inputLabel')}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        accessibilityLabel={t('journeys.health.wellness.chatActive.sendLabel')}
                        accessibilityRole="button"
                        testID="send-button"
                    >
                        <Text style={styles.sendIcon}>{'\u2191'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background.default,
        },
        headerBar: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            backgroundColor: colors.brand.primary,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backArrow: {
            fontSize: 20,
            color: theme.colors.text.onBrand,
            fontWeight: '600',
        },
        headerTitleRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerAvatarEmoji: {
            fontSize: 20,
            marginRight: spacingValues.xs,
        },
        screenTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.colors.text.onBrand,
        },
        headerSpacer: {
            width: 40,
        },
        keyboardView: {
            flex: 1,
        },
        messageList: {
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
        },
        messageBubbleRow: {
            flexDirection: 'row',
            marginBottom: spacingValues.sm,
            alignItems: 'flex-end',
        },
        messageRowUser: {
            justifyContent: 'flex-end',
        },
        messageRowAi: {
            justifyContent: 'flex-start',
        },
        aiAvatarSmall: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.brand.secondary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacingValues.xs,
        },
        aiAvatarEmoji: {
            fontSize: 14,
        },
        messageBubble: {
            maxWidth: '75%',
            paddingHorizontal: spacingValues.sm,
            paddingVertical: spacingValues.xs,
            borderRadius: borderRadiusValues.lg,
        },
        bubbleUser: {
            backgroundColor: colors.brand.primary,
            borderBottomRightRadius: borderRadiusValues.xs,
        },
        bubbleAi: {
            backgroundColor: theme.colors.background.subtle,
            borderBottomLeftRadius: borderRadiusValues.xs,
        },
        messageText: {
            fontSize: 15,
            lineHeight: 20,
        },
        messageTextUser: {
            color: theme.colors.text.onBrand,
        },
        messageTextAi: {
            color: theme.colors.text.default,
        },
        messageTime: {
            fontSize: 11,
            marginTop: spacingValues['4xs'],
        },
        timeUser: {
            color: theme.colors.text.onBrand + 'CC',
            textAlign: 'right',
        },
        timeAi: {
            color: theme.colors.text.muted,
        },
        typingContainer: {
            paddingHorizontal: spacingValues.md,
            paddingBottom: spacingValues.xs,
        },
        typingBubble: {
            flexDirection: 'row',
            backgroundColor: theme.colors.background.subtle,
            borderRadius: borderRadiusValues.lg,
            paddingHorizontal: spacingValues.md,
            paddingVertical: spacingValues.sm,
            alignSelf: 'flex-start',
            gap: spacingValues['3xs'],
        },
        typingDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.text.muted,
        },
        inputBar: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: spacingValues.sm,
            paddingVertical: spacingValues.xs,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.default,
        },
        quickReplyButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.background.subtle,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacingValues.xs,
        },
        quickReplyIcon: {
            fontSize: 18,
            color: colors.brand.primary,
        },
        textInput: {
            flex: 1,
            minHeight: 36,
            maxHeight: 100,
            paddingHorizontal: spacingValues.sm,
            paddingVertical: spacingValues.xs,
            backgroundColor: theme.colors.background.subtle,
            borderRadius: borderRadiusValues.lg,
            fontSize: 15,
            color: theme.colors.text.default,
        },
        sendButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.brand.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: spacingValues.xs,
        },
        sendButtonDisabled: {
            opacity: 0.4,
        },
        sendIcon: {
            fontSize: 18,
            color: theme.colors.text.onBrand,
            fontWeight: '700',
        },
    });

export default CompanionChatActiveScreen;
