import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { Product } from '@/models';

export function ProductCard({ product, stock, onPress }: { product: Product; stock: number; onPress: () => void }) {
  const colors = useColors();
  const low = stock <= product.minimumStock;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ backgroundColor: colors.card, borderRadius: 19, borderWidth: 1, borderColor: colors.border, padding: 12, flexDirection: 'row', gap: 13 }, pressed && { opacity: 0.78, transform: [{ scale: 0.99 }] }]}>
      <View style={{ width: 78, height: 78, borderRadius: 15, backgroundColor: product.imageColor, alignItems: 'center', justifyContent: 'center' }}>
        <Feather name={product.imageIcon as React.ComponentProps<typeof Feather>['name']} size={30} color={colors.charcoal} />
        <View style={{ position: 'absolute', bottom: 7, width: 30, height: 3, borderRadius: 2, backgroundColor: colors.primary }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
          <Text numberOfLines={1} style={{ flex: 1, color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 14 }}>{product.name}</Text>
          <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
        </View>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 }}>{product.sku} · {product.category}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 11 }}>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 15 }}>K {product.sellingPrice.toLocaleString()}</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: low ? colors.destructive : colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 13 }}>{stock} {product.unit}</Text>
            <Text style={{ color: low ? colors.destructive : colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 10 }}>{low ? 'Low stock' : 'In stock'}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}