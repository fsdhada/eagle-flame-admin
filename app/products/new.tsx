import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories } from '@/mock/data';
import { useColors } from '@/hooks/useColors';

export default function NewProductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: Math.max(insets.top, 12), paddingHorizontal: 20, paddingBottom: 35 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 22 }}><Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}><Feather name="arrow-left" size={18} color={colors.foreground} /></Pressable><View><Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 19 }}>Add product</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 }}>Create a finished-goods master record</Text></View></View>
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 15, marginBottom: 13 }}>Basic information</Text>
        {[['Product Name', name, setName, 'e.g. 2 Burner Stove Compact'], ['SKU / Product Code', sku, setSku, 'e.g. EF-2B-COMPACT']].map(([label, value, setter, placeholder]) => <View key={label as string} style={{ marginBottom: 16 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 11, marginBottom: 7 }}>{label as string}</Text><TextInput value={value as string} onChangeText={setter as (value: string) => void} placeholder={placeholder as string} placeholderTextColor={colors.mutedForeground} style={{ height: 50, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.input, paddingHorizontal: 13, color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 13 }} /></View>)}
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 11, marginBottom: 7 }}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>{categories.map((item) => <Pressable key={item.id} onPress={() => setCategory(item.name)} style={{ paddingHorizontal: 11, paddingVertical: 9, borderRadius: 10, backgroundColor: category === item.name ? colors.charcoal : colors.card, borderWidth: 1, borderColor: category === item.name ? colors.charcoal : colors.border }}><Text style={{ color: category === item.name ? colors.white : colors.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>{item.name}</Text></Pressable>)}</View>
        <View style={{ padding: 14, borderRadius: 16, backgroundColor: colors.secondary, flexDirection: 'row', gap: 9, marginBottom: 24 }}><Feather name="info" size={15} color={colors.primary} /><Text style={{ flex: 1, color: colors.secondaryForeground, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17 }}>You can add pricing, visibility, minimum stock and multiple images after creating the product.</Text></View>
        <Pressable onPress={() => { if (!name.trim() || !sku.trim()) { Alert.alert('Missing information', 'Add a product name and SKU before saving.'); return; } Alert.alert('Product saved', `${name} was added to the product master.`, [{ text: 'Done', onPress: () => router.back() }]); }} style={{ height: 53, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 14 }}>Save Product</Text></Pressable>
      </ScrollView>
    </View>
  );
}