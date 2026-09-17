import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: -0.3 }}>{title}</Text>
      {action && <Pressable onPress={onAction} style={({ pressed }) => [pressed && { opacity: 0.65 }]}><Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{action} <Feather name="arrow-up-right" size={12} /></Text></Pressable>}
    </View>
  );
}