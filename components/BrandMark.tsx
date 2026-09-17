import React from 'react';
import { Image, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function BrandMark({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  const colors = useColors();
  return (
    <View style={{ alignItems: 'flex-start', gap: 6 }}>
      <View style={{ backgroundColor: colors.white, borderRadius: compact ? 8 : 12, paddingHorizontal: compact ? 7 : 10, paddingVertical: compact ? 4 : 6 }}>
        <Image source={require('../assets/images/eagle-flame-logo.jpg')} resizeMode="contain" style={{ width: compact ? 104 : 190, height: compact ? 27 : 54 }} />
      </View>
      {!compact && <Text style={{ color: light ? '#D9DDE1' : colors.mutedForeground, fontSize: 10, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.6 }}>ADMIN & STOCK MANAGEMENT</Text>}
    </View>
  );
}