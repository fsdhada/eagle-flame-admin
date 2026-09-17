import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true, contentStyle }: { children: React.ReactNode; scroll?: boolean; contentStyle?: object }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const baseStyle = [styles.content, { paddingTop: paddingTop + 12, paddingBottom: Platform.OS === 'web' ? 100 : 106 }, contentStyle];
  if (!scroll) return <View style={[styles.root, { backgroundColor: colors.background }]}><View style={baseStyle}>{children}</View></View>;
  return <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={baseStyle} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20 },
});