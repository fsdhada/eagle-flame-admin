import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { StatCard } from '@/components/StatCard';
import { locations, products } from '@/mock/data';
import { useColors } from '@/hooks/useColors';
import { useMockStore } from '@/context/MockStoreContext';

export default function DashboardScreen() {
  const colors = useColors();
  const { balances, stockTransactions, sales } = useMockStore();
  const [location, setLocation] = useState('All Locations');
  const [showLocations, setShowLocations] = useState(false);
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), []);
  const lowStock = products.filter((product) => balances.filter((balance) => balance.productId === product.id).reduce((sum, balance) => sum + balance.quantity, 0) <= product.minimumStock);
  return (
    <Screen>
      <AppHeader title="Dashboard" />
      <Pressable onPress={() => setShowLocations((current) => !current)} style={{ height: 48, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}><Feather name="map-pin" size={15} color={colors.primary} /><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>{location}</Text></View><Feather name={showLocations ? 'chevron-up' : 'chevron-down'} size={16} color={colors.mutedForeground} />
      </Pressable>
      {showLocations && <View style={{ position: 'absolute', zIndex: 5, top: 119, left: 20, right: 20, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 7, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, elevation: 3 }}>
        {['All Locations', ...locations.map((item) => item.name)].map((item) => <Pressable key={item} onPress={() => { setLocation(item); setShowLocations(false); }} style={{ padding: 12, borderRadius: 10, backgroundColor: item === location ? colors.secondary : colors.card }}><Text style={{ color: item === location ? colors.primary : colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{item}</Text></Pressable>)}
      </View>}
      <SectionHeader title="Business overview" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
        <StatCard label="Total Products" value="33" icon="box" change="+3.2%" />
        <StatCard label="Total Stock Units" value="99" icon="layers" change="+8.1%" tone="success" />
        <StatCard label="Stock Value" value="K 86.4k" icon="credit-card" change="+5.4%" />
        <StatCard label="Low Stock" value={String(lowStock.length + 2)} icon="alert-triangle" tone="danger" />
        <StatCard label="Today's Stock In" value="16" icon="arrow-down-left" tone="success" />
        <StatCard label="Today's Stock Out" value="08" icon="arrow-up-right" tone="warning" />
        <StatCard label="Today's Sales" value="K 8.2k" icon="shopping-bag" />
        <StatCard label="Today's Transfers" value="04" icon="shuffle" tone="success" />
      </View>
      <SectionHeader title="Quick actions" />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
        {[['arrow-down-left', 'Stock In'], ['arrow-up-right', 'Stock Out'], ['shuffle', 'Transfer'], ['edit-3', 'Adjustment']].map(([icon, label]) => <Pressable key={label} onPress={() => router.push('/stock' as never)} style={({ pressed }) => [{ flex: 1, backgroundColor: label === 'Stock In' ? colors.primary : colors.card, borderRadius: 15, minHeight: 68, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: label === 'Stock In' ? 0 : 1, borderColor: colors.border }, pressed && { opacity: 0.7 }]}><Feather name={icon as React.ComponentProps<typeof Feather>['name']} size={18} color={label === 'Stock In' ? colors.white : colors.primary} /><Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: label === 'Stock In' ? colors.white : colors.foreground, marginTop: 7 }}>{label}</Text></Pressable>)}
      </View>
      <SectionHeader title="Low stock alerts" action="View all" onAction={() => router.push('/products' as never)} />
      <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, marginBottom: 22, overflow: 'hidden' }}>
        {lowStock.slice(0, 3).map((product, index) => {
          const quantity = balances.filter((balance) => balance.productId === product.id).reduce((sum, balance) => sum + balance.quantity, 0);
          return <Pressable key={product.id} onPress={() => router.push(`/products/${product.id}` as never)} style={{ flexDirection: 'row', alignItems: 'center', padding: 13, gap: 11, borderBottomWidth: index < Math.min(lowStock.length, 3) - 1 ? 1 : 0, borderBottomColor: colors.border }}><View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: '#FDEDEC', alignItems: 'center', justifyContent: 'center' }}><Feather name="alert-triangle" size={16} color={colors.destructive} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{product.name}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 3 }}>Minimum {product.minimumStock} {product.unit}</Text></View><Text style={{ color: colors.destructive, fontFamily: 'Inter_700Bold', fontSize: 12 }}>{quantity} {product.unit}</Text></Pressable>;
        })}
      </View>
      <SectionHeader title="Recent stock activity" action="Ledger" onAction={() => router.push('/stock/current' as never)} />
      <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, marginBottom: 22, overflow: 'hidden' }}>
        {stockTransactions.slice(0, 3).map((transaction, index) => <View key={transaction.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, borderBottomWidth: index < 2 ? 1 : 0, borderBottomColor: colors.border }}><View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: transaction.type === 'Stock In' ? colors.successSoft : transaction.type === 'Transfer' ? colors.infoSoft : '#FFF4DE', alignItems: 'center', justifyContent: 'center' }}><Feather name={transaction.type === 'Stock In' ? 'arrow-down-left' : transaction.type === 'Transfer' ? 'shuffle' : 'arrow-up-right'} size={15} color={transaction.type === 'Stock In' ? colors.success : transaction.type === 'Transfer' ? colors.info : colors.warning} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{transaction.type} <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }}>· {productMap.get(transaction.productId)?.name}</Text></Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 3 }}>{transaction.reference} · {transaction.createdAt}</Text></View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>{transaction.quantity > 0 ? '+' : ''}{transaction.quantity}</Text></View>)}
      </View>
      <SectionHeader title="Recent sales" action="Reports" onAction={() => router.push('/reports' as never)} />
      <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, overflow: 'hidden' }}>
        {sales.slice(0, 3).map((sale, index) => <View key={sale.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, borderBottomWidth: index < Math.min(sales.length, 3) - 1 ? 1 : 0, borderBottomColor: colors.border }}><View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}><Feather name="shopping-bag" size={15} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{sale.saleNumber}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 3 }}>{sale.customerName} · {sale.createdAt}</Text></View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>K {sale.lines.reduce((sum, line) => sum + line.quantity * line.sellingPrice - line.discount, 0).toLocaleString()}</Text></View>)}
      </View>
    </Screen>
  );
}
