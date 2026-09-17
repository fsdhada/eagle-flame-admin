import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { categories, currentUser, locations, suppliers } from '@/mock/data';
import { useColors } from '@/hooks/useColors';

const links = [
  { title: 'Categories', detail: 'Manage product groupings', icon: 'grid', count: categories.length },
  { title: 'Locations', detail: 'Warehouse, showroom and more', icon: 'map-pin', count: locations.length },
  { title: 'Suppliers', detail: 'Your supply partners', icon: 'truck', count: suppliers.length },
  { title: 'Users & Permissions', detail: 'Admin access and roles', icon: 'users' },
  { title: 'Settings', detail: 'Business preferences', icon: 'settings' },
  { title: 'Activity Log', detail: 'Every action, in one place', icon: 'clock' },
  { title: 'About', detail: 'Eagle Flame Admin', icon: 'info' },
];

export default function MoreScreen() {
  const colors = useColors();
  const { signOut } = useAuth();
  const handleLogout = () => Alert.alert('Log out?', 'You will need to sign in again to access the admin workspace.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/' as never); } }]);
  return (
    <Screen>
      <AppHeader title="More" subtitle="Workspace management" />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.charcoal, borderRadius: 19, padding: 15, marginBottom: 22 }}><View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 16 }}>{currentUser.initials}</Text></View><View style={{ flex: 1 }}><Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 14 }}>{currentUser.name}</Text><Text style={{ color: '#AEB4BA', fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 }}>{currentUser.email}</Text></View><View style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.charcoalSoft }}><Text style={{ color: colors.accent, fontFamily: 'Inter_600SemiBold', fontSize: 9 }}>ADMIN</Text></View></View>
      <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.8, marginBottom: 9 }}>WORKSPACE</Text>
      <View style={{ backgroundColor: colors.card, borderRadius: 19, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>{links.map((link, index) => <Pressable key={link.title} onPress={() => link.title === 'About' ? Alert.alert('Eagle Flame Admin', 'Internal stock and operations workspace. Customer website and Android app integration will connect later.') : undefined} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, borderBottomWidth: index < links.length - 1 ? 1 : 0, borderBottomColor: colors.border }, pressed && { backgroundColor: colors.background }]}><View style={{ width: 35, height: 35, borderRadius: 11, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}><Feather name={link.icon as React.ComponentProps<typeof Feather>['name']} size={16} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{link.title}</Text><Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 }}>{link.detail}</Text></View>{link.count ? <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_700Bold', fontSize: 12 }}>{link.count}</Text> : <Feather name="chevron-right" size={16} color={colors.mutedForeground} />}</Pressable>)}</View>
      <Pressable onPress={handleLogout} style={({ pressed }) => [{ height: 51, marginTop: 18, borderRadius: 15, borderWidth: 1, borderColor: '#F4C7C7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, pressed && { opacity: 0.7 }]}><Feather name="log-out" size={16} color={colors.destructive} /><Text style={{ color: colors.destructive, fontFamily: 'Inter_700Bold', fontSize: 13 }}>Logout</Text></Pressable>
      <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 10, textAlign: 'center', marginTop: 24 }}>Eagle Flame Admin v1.0.0</Text>
    </Screen>
  );
}