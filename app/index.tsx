import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';
import { BrandMark } from '@/components/BrandMark';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, user, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace('/(tabs)' as never);
  }, [isLoading, user]);

  const handleLogin = async () => {
    setSubmitting(true);
    setError('');
    const success = await signIn(username, password, remember);
    setSubmitting(false);
    if (success) router.replace('/(tabs)' as never);
    else setError('Incorrect username or password. Try the demo credentials below.');
  };

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: colors.charcoal }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: Math.max(insets.top, 22), paddingBottom: Math.max(insets.bottom, 24) }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.glow, { backgroundColor: colors.primary }]} />
          <BrandMark light />
          <View style={styles.heroCopy}>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>INTERNAL OPERATIONS</Text>
            <Text style={[styles.heroTitle, { color: colors.white }]}>Keep every flame{'\n'}moving forward.</Text>
            <Text style={[styles.heroSubtitle, { color: '#BFC4C9' }]}>Manage finished products, stock movements and your Eagle Flame team from one place.</Text>
          </View>
          <View style={styles.flameLine}>
            <View style={[styles.flameLineActive, { backgroundColor: colors.primary }]} />
            <View style={[styles.flameLineMuted, { backgroundColor: colors.charcoalSoft }]} />
          </View>
        </View>
        <View style={[styles.formCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Welcome back</Text>
          <Text style={[styles.formSubtitle, { color: colors.mutedForeground }]}>Sign in to your admin workspace</Text>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>Username / Email</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.input }]}>
              <Feather name="user" size={17} color={colors.mutedForeground} />
              <TextInput value={username} onChangeText={setUsername} placeholder="admin" placeholderTextColor={colors.mutedForeground} autoCapitalize="none" style={[styles.input, { color: colors.foreground }]} />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.input }]}>
              <Feather name="lock" size={17} color={colors.mutedForeground} />
              <TextInput value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor={colors.mutedForeground} secureTextEntry={!showPassword} style={[styles.input, { color: colors.foreground }]} />
              <Pressable onPress={() => setShowPassword((current) => !current)} hitSlop={10}><Feather name={showPassword ? 'eye-off' : 'eye'} size={17} color={colors.mutedForeground} /></Pressable>
            </View>
            <Text style={[styles.showPasswordHint, { color: colors.mutedForeground }]}>Show Password</Text>
          </View>
          {error ? <View style={[styles.errorBox, { backgroundColor: '#FDEDEC' }]}><Feather name="alert-circle" size={16} color={colors.destructive} /><Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text></View> : null}
          <View style={styles.formOptions}>
            <Pressable onPress={() => setRemember((current) => !current)} style={styles.rememberRow}>
              <View style={[styles.checkbox, { borderColor: remember ? colors.primary : colors.input, backgroundColor: remember ? colors.primary : colors.card }]}>{remember && <Feather name="check" size={12} color={colors.white} />}</View>
              <Text style={[styles.rememberText, { color: colors.mutedForeground }]}>Remember Me</Text>
            </Pressable>
            <Pressable><Text style={[styles.forgot, { color: colors.primary }]}>Forgot Password</Text></Pressable>
          </View>
          <Pressable disabled={submitting} onPress={handleLogin} style={({ pressed }) => [{ backgroundColor: colors.primary, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 22 }, pressed && { opacity: 0.8 }, submitting && { opacity: 0.6 }]}>
            <Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 15 }}>{submitting ? 'Signing in...' : 'Login'}</Text>
          </Pressable>
          <View style={[styles.demoNote, { backgroundColor: colors.secondary }]}>
            <Feather name="info" size={14} color={colors.primary} />
            <Text style={[styles.demoText, { color: colors.secondaryForeground }]}>Demo access: <Text style={{ fontFamily: 'Inter_700Bold' }}>admin</Text> / <Text style={{ fontFamily: 'Inter_700Bold' }}>admin123</Text></Text>
          </View>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>Eagle Flame Admin v1.0 · Internal use only</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { minHeight: 300, paddingHorizontal: 22, paddingTop: 6, justifyContent: 'space-between', overflow: 'hidden' },
  glow: { position: 'absolute', width: 250, height: 250, borderRadius: 150, opacity: 0.07, right: -90, top: 42 },
  heroCopy: { marginTop: 42, maxWidth: 330 },
  eyebrow: { fontFamily: 'Inter_700Bold', letterSpacing: 1.6, fontSize: 10, marginBottom: 10 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 31, letterSpacing: -1.2, lineHeight: 37 },
  heroSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginTop: 14, maxWidth: 310 },
  flameLine: { flexDirection: 'row', gap: 5, marginTop: 34 },
  flameLineActive: { height: 4, width: 44, borderRadius: 3 },
  flameLineMuted: { height: 4, width: 16, borderRadius: 3 },
  formCard: { flex: 1, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 28, marginTop: 18 },
  formTitle: { fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.6 },
  formSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 5, marginBottom: 23 },
  inputGroup: { marginBottom: 16 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginBottom: 8 },
  inputWrap: { height: 53, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 11 },
  input: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, height: '100%' },
  showPasswordHint: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 5 },
  errorBox: { borderRadius: 12, padding: 11, flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  errorText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 16 },
  formOptions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rememberText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  forgot: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  demoNote: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  demoText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  version: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 19, marginBottom: 4 },
});