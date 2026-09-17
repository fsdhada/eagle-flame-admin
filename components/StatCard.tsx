import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

type IconName = React.ComponentProps<typeof Feather>['name'];

export function StatCard({ label, value, icon, tone = 'default', change }: { label: string; value: string; icon: IconName; tone?: 'default' | 'danger' | 'success' | 'warning'; change?: string }) {
  const colors = useColors();
  const palette = {
    default: { icon: colors.info, bg: colors.infoSoft },
    danger: { icon: colors.destructive, bg: '#FDEDEC' },
    success: { icon: colors.success, bg: colors.successSoft },
    warning: { icon: colors.warning, bg: colors.warningSoft },
  }[tone];
  return (
    <View style={{ width: '48%', minHeight: 116, backgroundColor: colors.card, borderRadius: 18, padding: 15, borderWidth: 1, borderColor: colors.border, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ width: 32, height: 32, borderRadius: 11, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}><Feather name={icon} size={16} color={palette.icon} /></View>
        {change && <Text style={{ color: tone === 'danger' ? colors.destructive : colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>{change}</Text>}
      </View>
      <View><Text style={{ fontFamily: 'Inter_700Bold', fontSize: 21, color: colors.foreground, letterSpacing: -0.7 }}>{value}</Text><Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.mutedForeground, marginTop: 3 }}>{label}</Text></View>
    </View>
  );
}