import Card from '@/components/ui/card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Modal states
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [banksModalVisible, setBanksModalVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [blockchainModalVisible, setBlockchainModalVisible] = useState(false);

  // Notification toggles
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [investmentAlerts, setInvestmentAlerts] = useState(true);
  const [goalUpdates, setGoalUpdates] = useState(true);
  const [learningReminders, setLearningReminders] = useState(false);
  const [agentActivity, setAgentActivity] = useState(true);

  // Security toggles
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLock, setAutoLock] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate to sign-in page (outside tabs)
            router.replace('/sign-in');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const linkedBanks = [
    {
      id: 1,
      name: 'HDFC Bank',
      accountNumber: '****1234',
      type: 'Savings Account',
      icon: '🏦',
      color: '#004C8F',
      isPrimary: true,
      linkedDate: 'Jan 2024',
    },
    {
      id: 2,
      name: 'ICICI Bank',
      accountNumber: '****5678',
      type: 'Current Account',
      icon: '🏦',
      color: '#F37021',
      isPrimary: false,
      linkedDate: 'Mar 2024',
    },
  ];

  const menuItems = [
    {
      id: 1,
      title: 'Account Settings',
      icon: 'person-outline',
      color: colors.primary,
      onPress: () => setAccountModalVisible(true),
    },
    {
      id: 2,
      title: 'Linked Banks',
      icon: 'card-outline',
      color: colors.secondary,
      onPress: () => setBanksModalVisible(true),
    },
    {
      id: 3,
      title: 'Notifications',
      icon: 'notifications-outline',
      color: colors.warning,
      onPress: () => setNotificationsModalVisible(true),
    },
    {
      id: 4,
      title: 'Security & Privacy',
      icon: 'shield-checkmark-outline',
      color: colors.success,
      onPress: () => setSecurityModalVisible(true),
    },
    {
      id: 6,
      title: 'Web3 & Blockchain Audit',
      icon: 'cube-outline',
      color: '#8247E5',
      onPress: () => setBlockchainModalVisible(true),
    },
    {
      id: 5,
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: colors.info,
      onPress: () => setHelpModalVisible(true),
    },
  ];

  return (
    <LinearGradient
      colors={['#FAFAFA', '#F5F5FF', '#FFF5FA']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <Text style={styles.avatarText}>RS</Text>
            </View>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>Rahul Sharma</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            rahul@example.com
          </Text>
          <View style={styles.kycBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.kycText, { color: colors.success }]}>KYC Verified</Text>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>₹5,250</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Portfolio Value
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#FF6584" />
            <Text style={[styles.statValue, { color: colors.text }]}>15</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={[styles.statValue, { color: colors.text }]}>Level 3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rank</Text>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} onPress={item.onPress} activeOpacity={0.7}>
              <Card style={styles.menuCard}>
                <View style={styles.menuRow}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: item.color + '20' },
                    ]}
                  >
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Card style={styles.logoutCard}>
              <View style={styles.menuRow}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: colors.error + '20' },
                  ]}
                >
                  <Ionicons name="log-out-outline" size={24} color={colors.error} />
                </View>
                <Text style={[styles.menuTitle, { color: colors.error }]}>Logout</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          Gullak v1.0.0 • Powered by Agentic AI
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Account Settings Modal */}
      <Modal
        visible={accountModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAccountModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setAccountModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Account Settings</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Card style={styles.settingCard}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>Rahul Sharma</Text>
            </Card>

            <Card style={styles.settingCard}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>rahul@example.com</Text>
            </Card>

            <Card style={styles.settingCard}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Phone Number</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>+91 98765 43210</Text>
            </Card>

            <Card style={styles.settingCard}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Date of Birth</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>15 March 2000</Text>
            </Card>

            <Card style={styles.settingCard}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>PAN Number</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>ABCDE1234F</Text>
            </Card>

            <Card style={styles.settingCard}>
              <View style={styles.kycStatusRow}>
                <View>
                  <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>KYC Status</Text>
                  <View style={styles.kycBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={[styles.kycText, { color: colors.success }]}>Verified</Text>
                  </View>
                </View>
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success + '20' }]}>
                  <Ionicons name="shield-checkmark" size={24} color={colors.success} />
                </View>
              </View>
            </Card>

            <TouchableOpacity activeOpacity={0.7}>
              <View style={[styles.actionCard, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="create-outline" size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Linked Banks Modal */}
      <Modal
        visible={banksModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBanksModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setBanksModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Linked Banks</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {linkedBanks.map((bank) => (
              <Card key={bank.id} style={styles.bankCard}>
                <View style={styles.bankHeader}>
                  <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
                    <Text style={styles.bankEmoji}>{bank.icon}</Text>
                  </View>
                  <View style={styles.bankInfo}>
                    <View style={styles.bankTitleRow}>
                      <Text style={[styles.bankName, { color: colors.text }]}>{bank.name}</Text>
                      {bank.isPrimary && (
                        <View style={[styles.primaryBadge, { backgroundColor: colors.primary + '20' }]}>
                          <Text style={[styles.primaryText, { color: colors.primary }]}>Primary</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                      {bank.accountNumber}
                    </Text>
                    <Text style={[styles.accountType, { color: colors.textSecondary }]}>
                      {bank.type}
                    </Text>
                  </View>
                </View>

                <View style={[styles.bankFooter, { borderTopColor: colors.border }]}>
                  <View style={styles.bankMeta}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.linkedDate, { color: colors.textSecondary }]}>
                      Linked {bank.linkedDate}
                    </Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.7}>
                    <View style={styles.manageButton}>
                      <Ionicons name="settings-outline" size={16} color={colors.primary} />
                      <Text style={[styles.manageText, { color: colors.primary }]}>Manage</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={[styles.agentBanner, { backgroundColor: colors.warning + '10' }]}>
                  <Ionicons name="sparkles" size={14} color="#FFD700" />
                  <Text style={[styles.agentBannerText, { color: colors.textSecondary }]}>
                    Agent auto-manages transactions from this account
                  </Text>
                </View>
              </Card>
            ))}

            <TouchableOpacity activeOpacity={0.7}>
              <View style={[styles.actionCard, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Link New Bank Account</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.securityNote, { backgroundColor: colors.info + '10' }]}>
              <Ionicons name="shield-checkmark" size={20} color={colors.info} />
              <Text style={[styles.securityText, { color: colors.textSecondary }]}>
                Your bank details are encrypted and secured with 256-bit SSL
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={notificationsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNotificationsModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setNotificationsModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Notifications</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Card style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Push Notifications
                  </Text>
                  <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>
                    Get vibes about your investments 🔔
                  </Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={pushNotifications ? colors.primary : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Email Updates
                  </Text>
                  <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>
                    Weekly portfolio glow-up reports 📧
                  </Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={emailNotifications ? colors.primary : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Investment Alerts
                  </Text>
                  <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>
                    When your money moves, we hit you up 💰
                  </Text>
                </View>
                <Switch
                  value={investmentAlerts}
                  onValueChange={setInvestmentAlerts}
                  trackColor={{ false: colors.border, true: colors.success + '50' }}
                  thumbColor={investmentAlerts ? colors.success : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Goal Updates
                  </Text>
                  <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>
                    Progress check-ins & milestone hype 🎯
                  </Text>
                </View>
                <Switch
                  value={goalUpdates}
                  onValueChange={setGoalUpdates}
                  trackColor={{ false: colors.border, true: colors.secondary + '50' }}
                  thumbColor={goalUpdates ? colors.secondary : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    Learning Reminders
                  </Text>
                  <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>
                    Daily knowledge drops to level up 🎓
                  </Text>
                </View>
                <Switch
                  value={learningReminders}
                  onValueChange={setLearningReminders}
                  trackColor={{ false: colors.border, true: colors.warning + '50' }}
                  thumbColor={learningReminders ? colors.warning : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card style={styles.notificationCard}>
              <View style={styles.notificationRow}>
                <View style={styles.notificationInfo}>
                  <View style={styles.agentNotifHeader}>
                    <Text style={[styles.notificationTitle, { color: colors.text }]}>
                      Agent Activity
                    </Text>
                    <View style={styles.aiChip}>
                      <Ionicons name="sparkles" size={10} color="#FFD700" />
                      <Text style={styles.aiChipText}>AI</Text>
                    </View>
                  </View>
                  <Text style={[styles.notificationDesc, { color: colors.textSecondary }]}>
                    Real-time updates when agent makes moves 🤖
                  </Text>
                </View>
                <Switch
                  value={agentActivity}
                  onValueChange={setAgentActivity}
                  trackColor={{ false: colors.border, true: '#FFD700' + '50' }}
                  thumbColor={agentActivity ? '#FFD700' : '#f4f3f4'}
                />
              </View>
            </Card>

            <View style={[styles.genZNote, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.genZNoteText, { color: colors.text }]}>
                💡 Pro tip: Keep Agent Activity on to see your money work 24/7!
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Security & Privacy Modal */}
      <Modal
        visible={securityModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSecurityModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setSecurityModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Security & Privacy</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Authentication
            </Text>

            <Card style={styles.securityCard}>
              <View style={styles.securityRow}>
                <View style={styles.securityInfo}>
                  <View style={styles.securityTitleRow}>
                    <Ionicons name="finger-print" size={20} color={colors.primary} />
                    <Text style={[styles.securityTitle, { color: colors.text }]}>
                      Biometric Login
                    </Text>
                  </View>
                  <Text style={[styles.securityDesc, { color: colors.textSecondary }]}>
                    Use fingerprint or face ID
                  </Text>
                </View>
                <Switch
                  value={biometricAuth}
                  onValueChange={setBiometricAuth}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={biometricAuth ? colors.primary : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card style={styles.securityCard}>
              <View style={styles.securityRow}>
                <View style={styles.securityInfo}>
                  <View style={styles.securityTitleRow}>
                    <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                    <Text style={[styles.securityTitle, { color: colors.text }]}>
                      Two-Factor Authentication
                    </Text>
                  </View>
                  <Text style={[styles.securityDesc, { color: colors.textSecondary }]}>
                    Extra layer of protection
                  </Text>
                </View>
                <Switch
                  value={twoFactorAuth}
                  onValueChange={setTwoFactorAuth}
                  trackColor={{ false: colors.border, true: colors.success + '50' }}
                  thumbColor={twoFactorAuth ? colors.success : '#f4f3f4'}
                />
              </View>
            </Card>

            <Card style={styles.securityCard}>
              <View style={styles.securityRow}>
                <View style={styles.securityInfo}>
                  <View style={styles.securityTitleRow}>
                    <Ionicons name="lock-closed" size={20} color={colors.warning} />
                    <Text style={[styles.securityTitle, { color: colors.text }]}>
                      Auto-Lock
                    </Text>
                  </View>
                  <Text style={[styles.securityDesc, { color: colors.textSecondary }]}>
                    Lock app after 5 minutes
                  </Text>
                </View>
                <Switch
                  value={autoLock}
                  onValueChange={setAutoLock}
                  trackColor={{ false: colors.border, true: colors.warning + '50' }}
                  thumbColor={autoLock ? colors.warning : '#f4f3f4'}
                />
              </View>
            </Card>

            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, marginTop: 24 }]}>
              Privacy Settings
            </Text>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.privacyCard}>
                <View style={styles.privacyRow}>
                  <Ionicons name="key-outline" size={24} color={colors.primary} />
                  <Text style={[styles.privacyText, { color: colors.text }]}>Change Password</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.privacyCard}>
                <View style={styles.privacyRow}>
                  <Ionicons name="eye-off-outline" size={24} color={colors.secondary} />
                  <Text style={[styles.privacyText, { color: colors.text }]}>Data & Privacy</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.privacyCard}>
                <View style={styles.privacyRow}>
                  <Ionicons name="document-text-outline" size={24} color={colors.info} />
                  <Text style={[styles.privacyText, { color: colors.text }]}>Privacy Policy</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.privacyCard}>
                <View style={styles.privacyRow}>
                  <Ionicons name="reader-outline" size={24} color={colors.success} />
                  <Text style={[styles.privacyText, { color: colors.text }]}>Terms of Service</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>

            <View style={[styles.encryptionBanner, { backgroundColor: colors.success + '10' }]}>
              <Ionicons name="shield-checkmark" size={24} color={colors.success} />
              <View style={styles.encryptionInfo}>
                <Text style={[styles.encryptionTitle, { color: colors.text }]}>
                  256-bit Encryption
                </Text>
                <Text style={[styles.encryptionDesc, { color: colors.textSecondary }]}>
                  Your data is protected with bank-level security
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        visible={helpModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setHelpModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Help & Support</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.helpCard}>
                <View style={[styles.helpIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={[styles.helpTitle, { color: colors.text }]}>Chat with Agent</Text>
                  <Text style={[styles.helpDesc, { color: colors.textSecondary }]}>
                    AI assistant available 24/7
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.helpCard}>
                <View style={[styles.helpIcon, { backgroundColor: colors.success + '20' }]}>
                  <Ionicons name="call" size={24} color={colors.success} />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={[styles.helpTitle, { color: colors.text }]}>Call Support</Text>
                  <Text style={[styles.helpDesc, { color: colors.textSecondary }]}>
                    1800-123-4567 (Toll-free)
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.helpCard}>
                <View style={[styles.helpIcon, { backgroundColor: colors.secondary + '20' }]}>
                  <Ionicons name="mail" size={24} color={colors.secondary} />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={[styles.helpTitle, { color: colors.text }]}>Email Us</Text>
                  <Text style={[styles.helpDesc, { color: colors.textSecondary }]}>
                    support@gullak.com
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.helpCard}>
                <View style={[styles.helpIcon, { backgroundColor: colors.warning + '20' }]}>
                  <Ionicons name="book" size={24} color={colors.warning} />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={[styles.helpTitle, { color: colors.text }]}>FAQs</Text>
                  <Text style={[styles.helpDesc, { color: colors.textSecondary }]}>
                    Common questions answered
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.helpCard}>
                <View style={[styles.helpIcon, { backgroundColor: colors.info + '20' }]}>
                  <Ionicons name="document-text" size={24} color={colors.info} />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={[styles.helpTitle, { color: colors.text }]}>User Guide</Text>
                  <Text style={[styles.helpDesc, { color: colors.textSecondary }]}>
                    Learn how to use Gullak
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Card>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Card style={styles.helpCard}>
                <View style={[styles.helpIcon, { backgroundColor: '#FF6584' + '20' }]}>
                  <Ionicons name="bug" size={24} color="#FF6584" />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={[styles.helpTitle, { color: colors.text }]}>Report an Issue</Text>
                  <Text style={[styles.helpDesc, { color: colors.textSecondary }]}>
                    Found a bug? Let us know
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </Card>
            </TouchableOpacity>

            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, marginTop: 24 }]}>
              Social Media
            </Text>

            <View style={styles.socialContainer}>
              <TouchableOpacity activeOpacity={0.7} style={[styles.socialButton, { backgroundColor: '#1DA1F2' + '20' }]}>
                <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={[styles.socialButton, { backgroundColor: '#E4405F' + '20' }]}>
                <Ionicons name="logo-instagram" size={24} color="#E4405F" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={[styles.socialButton, { backgroundColor: '#0A66C2' + '20' }]}>
                <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={[styles.socialButton, { backgroundColor: '#25D366' + '20' }]}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              </TouchableOpacity>
            </View>

            <View style={[styles.responseTimeBanner, { backgroundColor: colors.primary + '10' }]}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={[styles.responseTimeText, { color: colors.text }]}>
                Average response time: <Text style={{ fontWeight: '800' }}>2 minutes</Text>
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Web3 & Blockchain Audit Modal */}
      <Modal
        visible={blockchainModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setBlockchainModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setBlockchainModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Web3 Audit Ledger</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Wallet Address Card */}
            <Card style={styles.blockchainCard}>
              <View style={styles.walletHeader}>
                <Ionicons name="wallet-outline" size={24} color="#8247E5" />
                <View style={styles.flex}>
                  <Text style={[styles.walletTitle, { color: colors.text }]}>Polygon Wallet</Text>
                  <Text style={[styles.walletAddress, { color: '#8247E5' }]} numberOfLines={1}>
                    0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyBtn, { backgroundColor: '#8247E5' + '15' }]}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Address Copied', 'Wallet address copied to clipboard!')}
                >
                  <Ionicons name="copy-outline" size={16} color="#8247E5" />
                </TouchableOpacity>
              </View>
            </Card>

            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Verified Smart Contracts (Mumbai Testnet)
            </Text>

            {/* Smart Contracts List */}
            <Card style={styles.settingCard}>
              <View style={styles.contractRow}>
                <View style={styles.flex}>
                  <Text style={[styles.contractLabel, { color: colors.text }]}>GullakLedger.sol (Registry)</Text>
                  <Text style={[styles.contractAddr, { color: colors.textSecondary }]}>0x8247e51a66ff56784abcde1234f9876543210123</Text>
                </View>
                <View style={styles.verifiedBadgeRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.verifiedTextSmall}>Verified</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.settingCard}>
              <View style={styles.contractRow}>
                <View style={styles.flex}>
                  <Text style={[styles.contractLabel, { color: colors.text }]}>GullakGoal.sol (Escrow)</Text>
                  <Text style={[styles.contractAddr, { color: colors.textSecondary }]}>0x6c63ff124caf50aa8976deab99bfdcf84ab9cde1</Text>
                </View>
                <View style={styles.verifiedBadgeRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.verifiedTextSmall}>Verified</Text>
                </View>
              </View>
            </Card>

            <Card style={styles.settingCard}>
              <View style={styles.contractRow}>
                <View style={styles.flex}>
                  <Text style={[styles.contractLabel, { color: colors.text }]}>GullakAIAudit.sol (Agent Auditor)</Text>
                  <Text style={[styles.contractAddr, { color: colors.textSecondary }]}>0xff6584ab8f88ff9c27b0ffa7264caf5023a41eef</Text>
                </View>
                <View style={styles.verifiedBadgeRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.verifiedTextSmall}>Verified</Text>
                </View>
              </View>
            </Card>

            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, marginTop: 16 }]}>
              Recent On-Chain Activity (Audit Trail)
            </Text>

            {/* Audit Logs */}
            {[
              { block: '17,290,314', action: 'Sync AI Goal Allocation', hash: '0x9d3af12e8247e51a66ff56784abcde1234f98765', status: 'Secured' },
              { block: '17,290,289', action: 'Manual Deposit (Razorpay)', hash: '0x8a230bf26c63ff124caf50aa8976deab99bfdcf8', status: 'Secured' },
              { block: '17,290,147', action: 'Round-Up Auto-Invest', hash: '0x2196c890ff6584ab8f88ff9c27b0ffa7264caf50', status: 'Secured' },
              { block: '17,289,956', action: 'KYC Address Verification', hash: '0x00bcd4ab76ffac0b34e56fa87eef9c27ab0ffab7', status: 'Secured' }
            ].map((log, index) => (
              <Card key={index} style={styles.auditLogCard}>
                <View style={styles.auditLogHeader}>
                  <View>
                    <Text style={[styles.auditBlock, { color: colors.text }]}>Block #{log.block}</Text>
                    <Text style={[styles.auditAction, { color: colors.textSecondary }]}>{log.action}</Text>
                  </View>
                  <View style={styles.securedLabel}>
                    <Ionicons name="cube" size={12} color="#4CAF50" />
                    <Text style={styles.securedLabelText}>{log.status}</Text>
                  </View>
                </View>
                <View style={styles.auditDivider} />
                <Text style={styles.auditHash} numberOfLines={1} ellipsizeMode="middle">
                  Tx Hash: {log.hash}
                </Text>
              </Card>
            ))}

            {/* Razorpay SDK Footer Info */}
            <View style={styles.blockchainFooter}>
              <Ionicons name="link-outline" size={16} color={colors.textTertiary} />
              <Text style={[styles.blockchainFooterText, { color: colors.textTertiary }]}>
                Verified via Razorpay Secure Checkout & Polygon Provider
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  userCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#6C63FF',
  },
  userName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs / 2,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.md,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  kycText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  menuCard: {
    marginBottom: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  logoutCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  versionText: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },

  // MODAL STYLES
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },

  // ACCOUNT SETTINGS
  settingCard: {
    marginBottom: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs / 2,
    textTransform: 'uppercase',
  },
  settingValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  kycStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },

  // LINKED BANKS
  bankCard: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  bankHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  bankIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  bankEmoji: {
    fontSize: 28,
  },
  bankInfo: {
    flex: 1,
  },
  bankTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs / 2,
    gap: Spacing.sm,
  },
  bankName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  primaryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  primaryText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  accountNumber: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs / 2,
  },
  accountType: {
    fontSize: Typography.fontSize.xs,
  },
  bankFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    marginBottom: Spacing.sm,
  },
  bankMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  linkedDate: {
    fontSize: Typography.fontSize.xs,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  manageText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  agentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  agentBannerText: {
    fontSize: Typography.fontSize.xs,
    flex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  securityText: {
    fontSize: Typography.fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },

  // NOTIFICATIONS
  notificationCard: {
    marginBottom: Spacing.md,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  notificationTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs / 2,
  },
  notificationDesc: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  agentNotifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs / 2,
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  aiChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFA500',
  },
  genZNote: {
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  genZNoteText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },

  // SECURITY & PRIVACY
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  securityCard: {
    marginBottom: Spacing.md,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  securityInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  securityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs / 2,
  },
  securityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  securityDesc: {
    fontSize: Typography.fontSize.sm,
  },
  privacyCard: {
    marginBottom: Spacing.sm,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  privacyText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  encryptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  encryptionInfo: {
    flex: 1,
  },
  encryptionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs / 2,
  },
  encryptionDesc: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },

  // HELP & SUPPORT
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs / 2,
  },
  helpDesc: {
    fontSize: Typography.fontSize.sm,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseTimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  responseTimeText: {
    fontSize: Typography.fontSize.sm,
    flex: 1,
  },
  // WEB3 & BLOCKCHAIN AUDIT MODAL STYLES
  flex: {
    flex: 1,
  },
  blockchainCard: {
    marginBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0D4FF',
    borderWidth: 1,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  walletTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
  walletAddress: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contractRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  contractLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  contractAddr: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedTextSmall: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '700',
  },
  auditLogCard: {
    marginBottom: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  auditLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  auditBlock: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  auditAction: {
    fontSize: 12,
    marginTop: 2,
  },
  securedLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  securedLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4CAF50',
  },
  auditDivider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 10,
  },
  auditHash: {
    fontSize: 9,
    color: '#8247E5',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  blockchainFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  blockchainFooterText: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    flex: 1,
  },
});
