import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { products, locations } from '@/mock/data';
import { useColors } from '@/hooks/useColors';
import { useMockStore } from '@/context/MockStoreContext';

export default function ProductDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getStock, getTotalStock } = useMockStore();
  const product = useMemo(() => products.find((item) => item.id === id) ?? products[0], [id]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [description, setDescription] = useState(product.shortDescription);
  const totalStock = getTotalStock(product.id);
  const fields = [
    ['Category', product.category],
    ['Brand', product.brand],
    ['Unit', product.unit],
    ['Minimum Stock', `${product.minimumStock} ${product.unit}`],
    ['Customer Visibility', product.customerVisibility],
    ['Featured Product', product.featured ? 'Yes' : 'No'],
    ['Sort Order', String(product.sortOrder)],
  ];
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 30) + 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [{ width: 40, height: 40, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.7 }]}><Feather name="arrow-left" size={18} color={colors.foreground} /></Pressable>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16 }}>Product details</Text>
          <Pressable onPress={() => setEditing((value) => !value)} style={({ pressed }) => [{ paddingHorizontal: 12, paddingVertical: 9, borderRadius: 11, backgroundColor: editing ? colors.charcoal : colors.secondary }, pressed && { opacity: 0.7 }]}><Text style={{ color: editing ? colors.white : colors.primary, fontFamily: 'Inter_700Bold', fontSize: 11 }}>{editing ? 'Done' : 'Edit'}</Text></Pressable>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ height: 164, borderRadius: 23, backgroundColor: product.imageColor, alignItems: 'center', justifyContent: 'center', marginBottom: 17 }}><Feather name={product.imageIcon as React.ComponentProps<typeof Feather>['name']} size={58} color={colors.charcoal} /><View style={{ position: 'absolute', bottom: 37, width: 58, height: 5, borderRadius: 4, backgroundColor: colors.primary }} /><View style={{ position: 'absolute', top: 14, right: 14, backgroundColor: colors.white, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 }}><Text style={{ color: colors.success, fontFamily: 'Inter_700Bold', fontSize: 9 }}>{product.status.toUpperCase()}</Text></View></View>
          {editing ? <TextInput value={name} onChangeText={setName} style={[styles.titleInput, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.card }]} /> : <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.7 }}>{name}</Text>}
          {editing ? <TextInput value={sku} onChangeText={setSku} style={[styles.inlineInput, { color: colors.mutedForeground, borderColor: colors.input, backgroundColor: colors.card }]} /> : <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 6 }}>{sku} · {product.category}</Text>}
          <View style={{ flexDirection: 'row', gap: 9, marginTop: 18, marginBottom: 22 }}>
            <View style={{ flex: 1, backgroundColor: colors.charcoal, borderRadius: 16, padding: 14 }}><Text style={{ color: '#AEB4BA', fontFamily: 'Inter_500Medium', fontSize: 9 }}>SELLING PRICE</Text><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 6 }}>K {product.sellingPrice.toLocaleString()}</Text></View>
            <View style={{ flex: 1, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14 }}><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 9 }}>CURRENT STOCK</Text><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 6 }}>{totalStock} {product.unit}</Text></View>
          </View>
          <Text style={styles.sectionTitle}>Product information</Text>
          {editing ? <TextInput value={description} onChangeText={setDescription} multiline style={[styles.descriptionInput, { color: colors.foreground, borderColor: colors.input, backgroundColor: colors.card }]} /> : <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 19, marginBottom: 15 }}>{description}</Text>}
          <View style={{ backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 22 }}>{fields.map(([label, value], index) => <View key={label} style={{ minHeight: 49, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: index < fields.length - 1 ? 1 : 0, borderBottomColor: colors.border }}><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>{label}</Text><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{value}</Text></View>)}</View>
          <Text style={styles.sectionTitle}>Internal pricing</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 22 }}><View style={{ flex: 1, backgroundColor: colors.warningSoft, borderRadius: 15, padding: 14 }}><Text style={{ color: colors.warning, fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>LANDING COST</Text><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 6 }}>K {product.landingCost.toLocaleString()}</Text></View><View style={{ flex: 1, backgroundColor: colors.successSoft, borderRadius: 15, padding: 14 }}><Text style={{ color: colors.success, fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>GROSS MARGIN</Text><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 6 }}>K {(product.sellingPrice - product.landingCost).toLocaleString()}</Text></View></View>
          <Text style={styles.sectionTitle}>Location stock</Text>
          <View style={{ backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>{locations.map((location, index) => { const quantity = getStock(product.id, location.id); return <View key={location.id} style={{ minHeight: 53, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: index < locations.length - 1 ? 1 : 0, borderBottomColor: colors.border }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}><Feather name="map-pin" size={14} color={colors.primary} /><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{location.name}</Text></View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 13 }}>{quantity} {product.unit}</Text></View> })}</View>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 16, marginTop: 15 }}>Landing cost and internal fields stay in the admin workspace and will never be exposed to customers.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 46, fontFamily: 'Inter_700Bold', fontSize: 20 },
  inlineInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, height: 36, marginTop: 7, fontFamily: 'Inter_500Medium', fontSize: 12 },
  descriptionInput: { minHeight: 82, borderWidth: 1, borderRadius: 13, padding: 12, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlignVertical: 'top', marginBottom: 15 },
  sectionTitle: { color: '#16181B', fontFamily: 'Inter_700Bold', fontSize: 15, marginBottom: 11 },
});