import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

export function AppHeader({ title, subtitle, onNotification }: { title: string; subtitle?: string; onNotification?: () => void }) {
  const colors = useColors();
  const { user } = useAuth();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 25, color: colors.foreground, letterSpacing: -0.8 }}>{title}</Text>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.mutedForeground, marginTop: 3 }}>{subtitle ?? `Good morning, ${user?.name.split(' ')[0] ?? 'Admin'}`}</Text>
      </View>
      <Pressable onPress={onNotification} style={({ pressed }) => [{ width: 42, height: 42, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.7 }]} accessibilityLabel="Notifications">
        <Feather name="bell" size={19} color={colors.foreground} />
        <View style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: colors.card }} />
      </Pressable>
    </View>
  );
}