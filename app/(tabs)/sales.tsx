import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { Screen } from '@/components/Screen';
import { useMockStore } from '@/context/MockStoreContext';
import { locations, products } from '@/mock/data';
import { useColors } from '@/hooks/useColors';
import type { PaymentMethod } from '@/models';

const paymentMethods: PaymentMethod[] = ['Cash', 'Mobile Money', 'Card', 'Bank Transfer', 'Credit', 'Other'];

export default function SalesScreen() {
  const colors = useColors();
  const { sales } = useMockStore();
  const posted = sales.filter((sale) => sale.status === 'POSTED');
  const todaySales = posted.filter((sale) => sale.date === new Date().toISOString().slice(0, 10));
  const total = todaySales.reduce((sum, sale) => sum + sale.lines.reduce((lineTotal, line) => lineTotal + line.quantity * line.sellingPrice - line.discount, 0), 0);
  const quantity = todaySales.reduce((sum, sale) => sum + sale.lines.reduce((lineTotal, line) => lineTotal + line.quantity, 0), 0);
  const paymentTotals = paymentMethods.map((method) => ({ method, amount: posted.filter((sale) => sale.paymentMethod === method).reduce((sum, sale) => sum + sale.lines.reduce((lineTotal, line) => lineTotal + line.quantity * line.sellingPrice - line.discount, 0), 0) })).filter((item) => item.amount > 0);
  const productName = (productId: string) => products.find((product) => product.id === productId)?.name ?? 'Product';
  const locationName = (locationId: string) => locations.find((location) => location.id === locationId)?.name ?? 'Location';
  return (
    <Screen>
      <AppHeader title="Sales" subtitle="Revenue and customer sales" />
      <Pressable onPress={() => router.push('/sales/new' as never)} style={({ pressed }) => [{ height: 58, borderRadius: 17, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 18 }, pressed && { opacity: 0.78 }]}><Feather name="plus-circle" size={20} color={colors.white} /><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 15 }}>NEW SALE</Text></Pressable>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 22 }}>
        {[
          ['Today\'s Sales Amount', `K ${total.toLocaleString()}`, 'trending-up', colors.success],
          ['Today\'s Quantity Sold', String(quantity), 'shopping-bag', colors.info],
          ['Number of Sales', String(todaySales.length), 'file-text', colors.primary],
          ['Credit / Outstanding', `K ${posted.filter((sale) => sale.paymentMethod === 'Credit').reduce((sum, sale) => sum + sale.lines.reduce((lineTotal, line) => lineTotal + line.quantity * line.sellingPrice - line.discount, 0), 0).toLocaleString()}`, 'clock', colors.warning],
        ].map(([label, value, icon, iconColor]) => <View key={label} style={{ width: '48%', backgroundColor: colors.card, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 14, minHeight: 100 }}><View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}><Feather name={icon as React.ComponentProps<typeof Feather>['name']} size={15} color={iconColor} /></View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 10 }}>{value}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 3 }}>{label}</Text></View>)}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16 }}>Recent sales</Text><Pressable onPress={() => router.push('/sales/history' as never)}><Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>Sales history <Feather name="arrow-up-right" size={11} /></Text></Pressable></View>
      <View style={{ backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 22 }}>{sales.slice(0, 4).map((sale, index) => <Pressable key={sale.id} onPress={() => router.push(`/sales/${sale.id}` as never)} style={({ pressed }) => [{ padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: index < Math.min(4, sales.length) - 1 ? 1 : 0, borderBottomColor: colors.border }, pressed && { backgroundColor: colors.background }]}><View style={{ width: 35, height: 35, borderRadius: 11, backgroundColor: sale.status === 'POSTED' ? colors.successSoft : colors.warningSoft, alignItems: 'center', justifyContent: 'center' }}><Feather name={sale.status === 'POSTED' ? 'check' : 'clock'} size={15} color={sale.status === 'POSTED' ? colors.success : colors.warning} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>{sale.saleNumber}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 3 }}>{sale.customerName || 'Walk-in Customer'} · {locationName(sale.locationId)}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 2 }}>{sale.lines.map((line) => productName(line.productId)).join(', ')}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>K {sale.lines.reduce((sum, line) => sum + line.quantity * line.sellingPrice - line.discount, 0).toLocaleString()}</Text><Text style={{ color: sale.status === 'POSTED' ? colors.success : colors.warning, fontFamily: 'Inter_600SemiBold', fontSize: 9, marginTop: 4 }}>{sale.status}</Text></View></Pressable>)}</View>
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 12 }}>Payment method summary</Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14 }}>{paymentTotals.length === 0 ? <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12 }}>No posted sales yet.</Text> : paymentTotals.map((item, index) => <View key={item.method} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: index < paymentTotals.length - 1 ? 1 : 0, borderBottomColor: colors.border }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: [colors.primary, colors.info, colors.success, colors.warning, colors.destructive, colors.charcoal][index % 6] }} /><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{item.method}</Text></View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>K {item.amount.toLocaleString()}</Text></View>)}</View>
    </Screen>
  );
}