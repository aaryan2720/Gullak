import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';
import { apiService } from '@/app/services/api';
import ChatBubble, { TypingIndicator } from '@/components/ui/chat-bubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentUsed?: string;
  suggestedActions?: string[];
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Gullak AI — your personal finance coach 🪙\n\nI can help you understand your portfolio, plan goals, and make smarter investment decisions. What's on your mind today?",
  suggestedActions: ['How are my investments doing?', 'Explain round-ups', 'Best goal for me?'],
  timestamp: new Date(),
};

const SESSION_ID = `session_${Date.now()}`;

export default function AICoachScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'dark'];
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [spendInsight, setSpendInsight] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  // Load chat history and spending insights on mount
  useEffect(() => {
    loadHistory();
    loadSpendingInsight();
  }, []);

  const loadSpendingInsight = async () => {
    try {
      // Fetch recent 30-day transactions for AI analysis
      const txData = await apiService.getTransactions({ page: 1, limit: 50 });
      const txs = (txData?.transactions || []).map((t: any) => ({
        amount: t.amount,
        merchant: t.metadata?.merchantName || 'Unknown',
        category: t.category,
        date: t.createdAt,
      }));
      if (txs.length > 0) {
        const insight = await apiService.getSpendingAnalysis(txs);
        if (insight?.insights) setSpendInsight(insight.insights);
      }
    } catch (e) {
      // Insight not available — not critical
    }
  };

  const loadHistory = async () => {
    try {
      const history = await apiService.getChatHistory();
      if (history && history.length > 0) {
        const mapped: Message[] = history.map((m: any) => ({
          id: m._id,
          role: m.role,
          content: m.content,
          agentUsed: m.agentUsed,
          suggestedActions: m.suggestedActions,
          timestamp: new Date(m.createdAt),
        }));
        setMessages([WELCOME_MESSAGE, ...mapped]);
      }
    } catch (e) {
      // No history yet, welcome message is shown
    } finally {
      setHistoryLoaded(true);
    }
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await apiService.chatWithAI(trimmed, SESSION_ID);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: res.data?.response || res.response || "I'm thinking through that...",
        agentUsed: res.data?.agentUsed || res.agentUsed,
        suggestedActions: res.data?.suggestedActions || res.suggestedActions || [],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const errMsg: Message = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [isLoading, scrollToBottom]);

  const renderItem = ({ item }: { item: Message }) => (
    <ChatBubble
      role={item.role}
      content={item.content}
      agentUsed={item.agentUsed}
      suggestedActions={item.suggestedActions}
      timestamp={item.timestamp}
      onSuggestionPress={(s) => sendMessage(s)}
    />
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : '#0A0E27'} />

      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#0D1128', '#111627'] : ['#0A0E27', '#111627']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.agentAvatar}>
            <Text style={{ fontSize: 20 }}>🪙</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Gullak AI Coach</Text>
            <Text style={styles.headerSub}>Powered by Gemini 1.5 Flash ✦</Text>
          </View>
        </View>
        <View style={styles.statusDot} />
      </LinearGradient>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Gemini Weekly Insight Card */}
        {spendInsight && (
          <View style={[styles.insightCard, { backgroundColor: isDark ? 'rgba(123,97,255,0.12)' : 'rgba(123,97,255,0.08)', borderColor: '#7B61FF40' }]}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightEmoji}>✦</Text>
              <Text style={[styles.insightTitle, { color: '#7B61FF' }]}>AI Spending Insight</Text>
            </View>
            <Text style={[styles.insightText, { color: colors.text }]}>{spendInsight}</Text>
          </View>
        )}

        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        />

        {/* Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask your AI coach..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceVariant }]}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage(inputText)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : colors.surfaceVariant }]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name={isLoading ? 'hourglass' : 'send'}
              size={18}
              color={inputText.trim() ? '#FFFFFF' : colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 16,
    paddingHorizontal: Spacing.md,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7B61FF25',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#7B61FF50',
  },
  headerTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: FontFamily.bodySemi,
  },
  headerSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: FontFamily.body,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FFB3',
    borderWidth: 2,
    borderColor: '#00FFB330',
  },
  messageList: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderTopWidth: 0.5,
  },
  input: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FontFamily.body,
    maxHeight: 100,
    lineHeight: 20,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightCard: {
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightEmoji: {
    fontSize: 14,
    color: '#7B61FF',
  },
  insightTitle: {
    fontFamily: FontFamily.headingSemi,
    fontSize: 13,
  },
  insightText: {
    fontFamily: FontFamily.body,
    fontSize: 13,
    lineHeight: 20,
  },
});

