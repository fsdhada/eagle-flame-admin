import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { Screen } from '@/components/Screen';
import { products } from '@/mock/data';
import { useColors } from '@/hooks/useColors';
import { useMockStore } from '@/context/MockStoreContext';

export default function ReportsScreen() {
  const colors = useColors();
  const { sales, getTotalStock } = useMockStore();
  const bars = [42, 68, 54, 81, 63, 92, 74];
  return (
    <Screen>
      <AppHeader title="Reports" subtitle="A quick view of business movement" />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 14 }}><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10 }}>SALES THIS WEEK</Text><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 7 }}>K 42.8k</Text><Text style={{ color: colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 10, marginTop: 4 }}>+12.4% vs last week</Text></View>
        <View style={{ flex: 1, backgroundColor: colors.charcoal, borderRadius: 17, padding: 14 }}><Text style={{ color: '#AEB4BA', fontFamily: 'Inter_500Medium', fontSize: 10 }}>STOCK VALUE</Text><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 7 }}>K 86.4k</Text><Text style={{ color: '#F5A04B', fontFamily: 'Inter_600SemiBold', fontSize: 10, marginTop: 4 }}>99 posted units</Text></View>
      </View>
      <View style={{ backgroundColor: colors.card, borderRadius: 19, borderWidth: 1, borderColor: colors.border, padding: 17, marginBottom: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 15 }}>Sales activity</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 }}>Mon 09 Sep – Sun 15 Sep</Text></View><Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>This week</Text><Feather name="chevron-down" size={14} color={colors.primary} /></Pressable></View>
        <View style={{ height: 145, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 22 }}>{bars.map((height, index) => <View key={index} style={{ alignItems: 'center', gap: 8 }}><View style={{ width: 24, height, borderRadius: 7, backgroundColor: index === 5 ? colors.primary : colors.secondary }} /><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 9 }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text></View>)}</View>
      </View>
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 12 }}>Top products by value</Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 19, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>{products.slice(0, 4).map((product, index) => { const stock = getTotalStock(product.id); return <View key={product.id} style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: index < 3 ? 1 : 0, borderBottomColor: colors.border }}><View style={{ width: 26, height: 26, borderRadius: 9, backgroundColor: index === 0 ? colors.secondary : colors.muted, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: index === 0 ? colors.primary : colors.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 11 }}>{index + 1}</Text></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{product.name}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 3 }}>{stock} {product.unit} available</Text></View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>K {(stock * product.sellingPrice).toLocaleString()}</Text></View> })}</View>
      <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, textAlign: 'center', marginTop: 18 }}>Reports will expand when sales and finance sync is connected.</Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10, textAlign: 'center', marginTop: 6 }}>{sales.length} sales in the activity feed</Text>
    </Screen>
  );
}