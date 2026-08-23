import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  agentUsed?: string;
  suggestedActions?: string[];
  timestamp?: Date;
  onSuggestionPress?: (suggestion: string) => void;
  style?: ViewStyle;
}

export default function ChatBubble({
  role,
  content,
  agentUsed,
  suggestedActions = [],
  timestamp,
  onSuggestionPress,
  style,
}: ChatBubbleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const slideAnim = useRef(new Animated.Value(role === 'user' ? 30 : -30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = role === 'user';

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        { opacity: opacityAnim, transform: [{ translateX: slideAnim }] },
        style,
      ]}
    >
      {/* Avatar (AI only) */}
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: '#7B61FF20' }]}>
          <Text style={styles.avatarEmoji}>🪙</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? [styles.userBubble, { backgroundColor: '#7B61FF' }] : [styles.aiBubble, { backgroundColor: colors.surfaceElevated, borderColor: colors.glassBorder, borderWidth: 1 }]]}>
        <Text style={[styles.content, { color: isUser ? '#FFFFFF' : colors.text }]}>
          {content}
        </Text>

        {/* Agent used label */}
        {!isUser && agentUsed && (
          <Text style={[styles.agentLabel, { color: colors.textTertiary }]}>
            via {agentUsed}
          </Text>
        )}

        {/* Timestamp */}
        {timestamp && (
          <Text style={[styles.timestamp, { color: isUser ? 'rgba(255,255,255,0.6)' : colors.textTertiary }]}>
            {timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>

      {/* Suggested action chips (AI only) */}
      {!isUser && suggestedActions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestedActions.map((action, i) => (
            <Animated.View key={i} style={{ opacity: opacityAnim }}>
              <Text
                style={[styles.suggestionChip, { backgroundColor: '#7B61FF15', color: '#9B85FF', borderColor: '#7B61FF30' }]}
                onPress={() => onSuggestionPress?.(action)}
              >
                {action}
              </Text>
            </Animated.View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

export function TypingIndicator() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  return (
    <View style={[styles.assistantContainer, { marginBottom: 12 }]}>
      <View style={[styles.avatar, { backgroundColor: '#7B61FF20' }]}>
        <Text style={styles.avatarEmoji}>🪙</Text>
      </View>
      <View style={[styles.bubble, styles.aiBubble, { backgroundColor: colors.surfaceElevated, borderColor: colors.glassBorder, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14 }]}>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', height: 20 }}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#7B61FF' }, { transform: [{ translateY: dot }] }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  agentLabel: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginLeft: 40,
    paddingHorizontal: 16,
  },
  suggestionChip: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
