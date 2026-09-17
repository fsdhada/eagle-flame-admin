import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMockStore } from '@/context/MockStoreContext';
import { locations, products } from '@/mock/data';
import { useColors } from '@/hooks/useColors';
import type { PaymentMethod, SaleLine } from '@/models';

type DraftLine = SaleLine & { expanded?: boolean };
const paymentMethods: PaymentMethod[] = ['Cash', 'Mobile Money', 'Card', 'Bank Transfer', 'Credit', 'Other'];
const lineId = () => `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export default function NewSaleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const { sales, getStock, saveDraftSale, postSale } = useMockStore();
  const existingDraft = sales.find((sale) => sale.id === draftId);
  const [locationId, setLocationId] = useState(existingDraft?.locationId ?? locations[0].id);
  const [customerName, setCustomerName] = useState(existingDraft?.customerName ?? '');
  const [customerPhone, setCustomerPhone] = useState(existingDraft?.customerPhone ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(existingDraft?.paymentMethod ?? 'Cash');
  const [paymentReference, setPaymentReference] = useState(existingDraft?.paymentReference ?? '');
  const [remarks, setRemarks] = useState(existingDraft?.remarks ?? '');
  const [lines, setLines] = useState<DraftLine[]>(existingDraft?.lines.map((line) => ({ ...line })) ?? [{ id: lineId(), productId: products[0].id, quantity: 1, unit: products[0].unit, sellingPrice: products[0].sellingPrice, discount: 0 }]);
  const [saving, setSaving] = useState(false);
  const saleNumberPreview = existingDraft?.saleNumber ?? 'SAL-0001';
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.sellingPrice, 0);
  const discount = lines.reduce((sum, line) => sum + line.discount, 0);
  const grandTotal = subtotal - discount;
  const updateLine = (id: string, patch: Partial<DraftLine>) => setLines((current) => current.map((line) => line.id === id ? { ...line, ...patch } : line));
  const selectProduct = (id: string, productId: string) => {
    const product = products.find((item) => item.id === productId) ?? products[0];
    updateLine(id, { productId, unit: product.unit, sellingPrice: product.sellingPrice });
  };
  const validate = () => {
    if (!customerName.trim()) return 'Add a customer name or use "Walk-in Customer".';
    if (lines.some((line) => line.quantity <= 0)) return 'Each product quantity must be at least 1.';
    if (lines.some((line) => line.quantity > getStock(line.productId, locationId))) return 'A sale quantity is greater than available stock at this location.';
    return undefined;
  };
  const input = useMemo(() => ({ date: new Date().toISOString().slice(0, 10), locationId, customerName: customerName.trim(), customerPhone, paymentMethod, paymentReference, remarks, lines: lines.map(({ expanded, ...line }) => line) }), [customerName, customerPhone, lines, locationId, paymentMethod, paymentReference, remarks]);
  const save = async (post: boolean) => {
    const error = post ? validate() : (customerName.trim() ? undefined : 'Add a customer name or use "Walk-in Customer".');
    if (error) { Alert.alert('Check sale details', error); return; }
    setSaving(true);
    try {
      if (post) {
        Alert.alert('Post sale?', 'This will reduce stock at the selling location and add the sale to revenue.', [{ text: 'Cancel', style: 'cancel', onPress: () => setSaving(false) }, { text: 'Post Sale', onPress: async () => { try { await postSale(input); setSaving(false); router.replace('/sales/history' as never); } catch (postError) { setSaving(false); Alert.alert('Sale not posted', postError instanceof Error ? postError.message : 'Please check stock and try again.'); } } }]);
      } else {
        await saveDraftSale(input);
        setSaving(false);
        router.replace('/sales/history' as never);
      }
    } catch (error) {
      setSaving(false);
      Alert.alert('Unable to save', error instanceof Error ? error.message : 'Please try again.');
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: Math.max(insets.top, 12), paddingHorizontal: 20, paddingBottom: 38 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 20 }}><Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}><Feather name="arrow-left" size={18} color={colors.foreground} /></Pressable><View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 19 }}>{existingDraft ? 'Edit draft sale' : 'New sale'}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 }}>{saleNumberPreview} · {new Date().toISOString().slice(0, 10)}</Text></View></View>
        <Text style={styles.sectionTitle}>Sale information</Text>
        <View style={styles.card}><Field label="Customer Name" value={customerName} onChangeText={setCustomerName} placeholder="Walk-in Customer" colors={colors} /><Field label="Customer Phone" value={customerPhone} onChangeText={setCustomerPhone} placeholder="+260 ..." colors={colors} keyboardType="phone-pad" /><Text style={styles.label}>Selling Location</Text><View style={styles.chipRow}>{locations.map((location) => <Chip key={location.id} active={location.id === locationId} label={location.name} onPress={() => setLocationId(location.id)} colors={colors} />)}</View><Text style={styles.label}>Payment Method</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{paymentMethods.map((method) => <Chip key={method} active={method === paymentMethod} label={method} onPress={() => setPaymentMethod(method)} colors={colors} />)}</ScrollView><Field label="Payment Reference" value={paymentReference} onChangeText={setPaymentReference} placeholder="Optional reference" colors={colors} /><Field label="Remarks" value={remarks} onChangeText={setRemarks} placeholder="Optional notes" colors={colors} /></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 11 }}><Text style={styles.sectionTitle}>Products</Text><Pressable onPress={() => setLines((current) => [...current, { id: lineId(), productId: products[0].id, quantity: 1, unit: products[0].unit, sellingPrice: products[0].sellingPrice, discount: 0 }])} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><Feather name="plus" size={14} color={colors.primary} /><Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 11 }}>Add product</Text></Pressable></View>
        <View style={{ gap: 10 }}>{lines.map((line, index) => { const product = products.find((item) => item.id === line.productId) ?? products[0]; const available = getStock(line.productId, locationId); const total = line.quantity * line.sellingPrice - line.discount; return <View key={line.id} style={styles.card}><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>Item {index + 1}</Text>{lines.length > 1 && <Pressable onPress={() => setLines((current) => current.filter((item) => item.id !== line.id))}><Feather name="trash-2" size={15} color={colors.destructive} /></Pressable>}</View><Text style={styles.label}>Product</Text><Pressable onPress={() => updateLine(line.id, { expanded: !line.expanded })} style={{ minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{product.name}</Text><Feather name={line.expanded ? 'chevron-up' : 'chevron-down'} size={15} color={colors.mutedForeground} /></Pressable>{line.expanded && <View style={{ backgroundColor: colors.background, borderRadius: 12, marginTop: 5, padding: 5 }}>{products.map((option) => <Pressable key={option.id} onPress={() => selectProduct(line.id, option.id)} style={{ padding: 10, borderRadius: 9, backgroundColor: option.id === line.productId ? colors.secondary : colors.background }}><Text style={{ color: option.id === line.productId ? colors.primary : colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>{option.name}</Text></Pressable>)}</View>}<Text style={{ color: available > 0 ? colors.success : colors.destructive, fontFamily: 'Inter_600SemiBold', fontSize: 10, marginTop: 7 }}>Available at {locations.find((item) => item.id === locationId)?.name}: {available} {product.unit}</Text><View style={{ flexDirection: 'row', gap: 8, marginTop: 11 }}><MiniField label="Quantity" value={String(line.quantity)} onChange={(value) => updateLine(line.id, { quantity: Math.max(0, Number(value.replace(/[^0-9]/g, '')) || 0) })} colors={colors} /><MiniField label={`Price / ${product.unit}`} value={String(line.sellingPrice)} onChange={(value) => updateLine(line.id, { sellingPrice: Number(value.replace(/[^0-9]/g, '')) || 0 })} colors={colors} /><MiniField label="Discount" value={String(line.discount)} onChange={(value) => updateLine(line.id, { discount: Number(value.replace(/[^0-9]/g, '')) || 0 })} colors={colors} /></View><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 11 }}><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>Line total</Text><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 13 }}>K {total.toLocaleString()}</Text></View></View> })}</View>
        <View style={{ backgroundColor: colors.charcoal, borderRadius: 18, padding: 16, marginTop: 18, gap: 10 }}><SummaryRow label="Number of Items" value={String(lines.length)} colors={colors} /><SummaryRow label="Total Quantity" value={String(lines.reduce((sum, line) => sum + line.quantity, 0))} colors={colors} /><SummaryRow label="Subtotal" value={`K ${subtotal.toLocaleString()}`} colors={colors} /><SummaryRow label="Discount" value={`K ${discount.toLocaleString()}`} colors={colors} /><View style={{ borderTopWidth: 1, borderTopColor: colors.charcoalSoft, paddingTop: 11, marginTop: 2 }}><SummaryRow label="Grand Total" value={`K ${grandTotal.toLocaleString()}`} colors={colors} strong /></View></View>
        <View style={{ flexDirection: 'row', gap: 9, marginTop: 16 }}><Pressable disabled={saving} onPress={() => save(false)} style={{ flex: 1, height: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>SAVE DRAFT</Text></Pressable><Pressable disabled={saving} onPress={() => save(true)} style={{ flex: 1, height: 52, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 12 }}>{saving ? 'SAVING...' : 'POST SALE'}</Text></Pressable></View>
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, colors, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; colors: ReturnType<typeof useColors>; keyboardType?: 'phone-pad' }) {
  return <View style={{ marginBottom: 13 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 11, marginBottom: 7 }}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} keyboardType={keyboardType} style={{ height: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 12, color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 12 }} /></View>;
}
function MiniField({ label, value, onChange, colors }: { label: string; value: string; onChange: (value: string) => void; colors: ReturnType<typeof useColors> }) {
  return <View style={{ flex: 1 }}><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 9, marginBottom: 5 }}>{label}</Text><TextInput value={value} onChangeText={onChange} keyboardType="number-pad" style={{ height: 42, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, paddingHorizontal: 9, color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 11 }} /></View>;
}
function Chip({ active, label, onPress, colors }: { active: boolean; label: string; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return <Pressable onPress={onPress} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9, backgroundColor: active ? colors.secondary : colors.background, borderWidth: 1, borderColor: active ? colors.primary : colors.border, marginRight: 6 }}><Text style={{ color: active ? colors.primary : colors.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>{label}</Text></Pressable>;
}
function SummaryRow({ label, value, colors, strong = false }: { label: string; value: string; colors: ReturnType<typeof useColors>; strong?: boolean }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: strong ? colors.white : '#AEB4BA', fontFamily: strong ? 'Inter_700Bold' : 'Inter_500Medium', fontSize: strong ? 14 : 11 }}>{label}</Text><Text style={{ color: strong ? colors.accent : colors.white, fontFamily: 'Inter_700Bold', fontSize: strong ? 17 : 11 }}>{value}</Text></View>;
}
const styles = { sectionTitle: { color: '#16181B', fontFamily: 'Inter_700Bold' as const, fontSize: 15, marginBottom: 11 }, card: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E6E8EA', padding: 14 }, label: { color: '#727980', fontFamily: 'Inter_600SemiBold' as const, fontSize: 10, marginBottom: 7 }, chipRow: { flexDirection: 'row' as const, gap: 0, marginBottom: 14 } };