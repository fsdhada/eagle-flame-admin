import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { Screen } from '@/components/Screen';
import { products, locations } from '@/mock/data';
import { useMockStore } from '@/context/MockStoreContext';
import { useColors } from '@/hooks/useColors';

const actions = [
  { title: 'Products / Product Master', detail: 'Manage finished products and SKUs', icon: 'box', color: 'primary' as const, route: '/products' },
  { title: 'Current Stock', detail: 'View inventory by location', icon: 'layers', color: 'info' as const, route: '/stock/current' },
  { title: 'Stock In', detail: 'Receive finished products', icon: 'arrow-down-left', color: 'success' as const, route: '/stock/in-history' },
  { title: 'Stock Transfer', detail: 'Move between locations', icon: 'shuffle', color: 'primary' as const, route: '/stock/transfer-history' },
  { title: 'Stock Out', detail: 'Reduce stock without revenue', icon: 'arrow-up-right', color: 'warning' as const, route: '/stock/out' },
  { title: 'Stock Adjustment', detail: 'Correct with an audit trail', icon: 'edit-3', color: 'danger' as const, route: '/stock/adjustment' },
  { title: 'Stock Ledger', detail: 'Review posted and draft moves', icon: 'book-open', color: 'charcoal' as const, route: '/stock/ledger' },
];

export default function StockScreen() {
  const colors = useColors();
  const { balances, stockTransactions } = useMockStore();
  const tone = { info: { bg: colors.infoSoft, icon: colors.info }, success: { bg: colors.successSoft, icon: colors.success }, primary: { bg: colors.secondary, icon: colors.primary }, warning: { bg: colors.warningSoft, icon: colors.warning }, danger: { bg: '#FDEDEC', icon: colors.destructive }, charcoal: { bg: colors.muted, icon: colors.charcoal } };
  const postedTransactions = stockTransactions.filter((transaction) => transaction.status === 'POSTED').length;
  const totalUnits = balances.reduce((sum, balance) => sum + balance.quantity, 0);
  return (
    <Screen>
      <AppHeader title="Stock Hub" subtitle="Ledger-led finished goods control" />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 23 }}>
        <View style={{ flex: 1, borderRadius: 17, backgroundColor: colors.charcoal, padding: 15 }}><Text style={{ color: '#BFC4C9', fontFamily: 'Inter_500Medium', fontSize: 10 }}>POSTED STOCK UNITS</Text><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 24, marginTop: 5 }}>{totalUnits}</Text><Text style={{ color: '#9EA5AB', fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 }}>Across {locations.length} locations</Text></View>
        <View style={{ flex: 1, borderRadius: 17, backgroundColor: colors.card, padding: 15, borderWidth: 1, borderColor: colors.border }}><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10 }}>POSTED TRANSACTIONS</Text><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 24, marginTop: 5 }}>{postedTransactions}</Text><Text style={{ color: colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 10, marginTop: 4 }}>Drafts do not affect stock</Text></View>
      </View>
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 17, letterSpacing: -0.3, marginBottom: 12 }}>Operations</Text>
      <View style={{ gap: 10, marginBottom: 25 }}>{actions.map((action) => <Pressable key={action.title} onPress={() => router.push(action.route as never)} style={({ pressed }) => [{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 13 }, pressed && { opacity: 0.75 }]}><View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: tone[action.color].bg, alignItems: 'center', justifyContent: 'center' }}><Feather name={action.icon as React.ComponentProps<typeof Feather>['name']} size={19} color={tone[action.color].icon} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 13 }}>{action.title}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 }}>{action.detail}</Text></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} /></Pressable>)}</View>
      <View style={{ padding: 15, borderRadius: 17, backgroundColor: colors.secondary, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}><Feather name="shield" size={17} color={colors.primary} /><View style={{ flex: 1 }}><Text style={{ color: colors.secondaryForeground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>Inventory protection is on</Text><Text style={{ color: colors.secondaryForeground, opacity: 0.75, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, marginTop: 4 }}>Only POSTED transactions affect quantities. Every adjustment keeps its audit history.</Text></View></View>
    </Screen>
  );
}