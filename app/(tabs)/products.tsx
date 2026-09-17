import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { ProductCard } from '@/components/ProductCard';
import { Screen } from '@/components/Screen';
import { categories, products } from '@/mock/data';
import { useMockStore } from '@/context/MockStoreContext';
import { useColors } from '@/hooks/useColors';

export default function ProductsScreen() {
  const colors = useColors();
  const { getTotalStock } = useMockStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const filteredProducts = useMemo(() => products.filter((product) => (category === 'All' || product.category === category) && `${product.name} ${product.sku}`.toLowerCase().includes(search.toLowerCase())), [category, search]);
  return (
    <Screen>
      <AppHeader title="Products" subtitle={`${products.length + 28} finished products in master`} />
      <View style={{ flexDirection: 'row', gap: 9, marginBottom: 14 }}>
        <View style={{ flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 }}><Feather name="search" size={17} color={colors.mutedForeground} /><TextInput value={search} onChangeText={setSearch} placeholder="Search products or SKU" placeholderTextColor={colors.mutedForeground} style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.foreground }} /></View>
        <Pressable onPress={() => router.push('/products/new' as never)} style={({ pressed }) => [{ height: 48, width: 48, backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, pressed && { opacity: 0.75 }]} accessibilityLabel="Add Product"><Feather name="plus" size={21} color={colors.white} /></Pressable>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.5, marginBottom: 8 }}>CATEGORY</Text>
        <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap' }}>
          {['All', ...categories.map((item) => item.name)].map((item) => <Pressable key={item} onPress={() => setCategory(item)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: category === item ? colors.charcoal : colors.card, borderWidth: 1, borderColor: category === item ? colors.charcoal : colors.border }}><Text style={{ color: category === item ? colors.white : colors.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>{item}</Text></Pressable>)}
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 16 }}>Product master</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>{filteredProducts.length} shown</Text></View>
      <View style={{ gap: 10 }}>{filteredProducts.map((product) => <ProductCard key={product.id} product={product} stock={getTotalStock(product.id)} onPress={() => router.push(`/products/${product.id}` as never)} />)}</View>
      {filteredProducts.length === 0 && <View style={{ alignItems: 'center', paddingVertical: 60 }}><Feather name="search" size={26} color={colors.mutedForeground} /><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 12 }}>No products match your search.</Text></View>}
    </Screen>
  );
}