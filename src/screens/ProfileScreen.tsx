import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, TextInput, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import AvatarBadge from '../components/AvatarBadge';
import { useProfileStore } from '../store/profileStore';
import { SKINS_CATALOG, RARITY_COLORS, getSkin, Skin } from '../types/profile';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  route: RouteProp<RootStackParamList, 'Profile'>;
};

export default function ProfileScreen({ navigation, route }: Props) {
  const { playerSlot } = route.params;
  const profile = useProfileStore(s => s[playerSlot]);
  const { updateName, equipSkin, buySkin } = useProfileStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [notice, setNotice] = useState<string | null>(null);

  const activeSkin = getSkin(profile.activeSkinId);
  const winRate = profile.stats.gamesPlayed > 0
    ? Math.round((profile.stats.wins / profile.stats.gamesPlayed) * 100)
    : 0;

  const handleSaveName = () => {
    updateName(playerSlot, nameInput);
    setEditingName(false);
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2000);
  };

  const handleSkinPress = (skin: Skin) => {
    if (skin.id === profile.activeSkinId) return;
    if (profile.unlockedSkinIds.includes(skin.id)) {
      equipSkin(playerSlot, skin.id);
      return;
    }
    if (!skin.price) return;
    const success = buySkin(playerSlot, skin.id);
    if (!success) showNotice(`Not enough coins — need 💰 ${skin.price}`);
  };

  const renderSkinCard = ({ item: skin }: { item: Skin }) => {
    const isEquipped = skin.id === profile.activeSkinId;
    const isOwned = profile.unlockedSkinIds.includes(skin.id);
    const canAfford = skin.price ? profile.coins >= skin.price : true;

    return (
      <TouchableOpacity
        style={[styles.skinCard, isEquipped && styles.skinCardEquipped]}
        onPress={() => handleSkinPress(skin)}
        activeOpacity={0.75}
      >
        <LinearGradient
          colors={skin.colors}
          style={styles.skinPreview}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Text style={styles.skinName}>{skin.name}</Text>
        <View style={[
          styles.rarityChip,
          { borderColor: RARITY_COLORS[skin.rarity] },
        ]}>
          <Text style={[styles.rarityText, { color: RARITY_COLORS[skin.rarity] }]}>
            {skin.rarity.toUpperCase()}
          </Text>
        </View>
        {isEquipped ? (
          <View style={styles.equippedBadge}>
            <Text style={styles.equippedText}>✓ ON</Text>
          </View>
        ) : isOwned ? (
          <Text style={styles.ownedText}>OWNED</Text>
        ) : (
          <View style={[styles.priceChip, !canAfford && styles.priceChipLocked]}>
            <Text style={[styles.priceText, !canAfford && styles.priceTextLocked]}>
              💰 {skin.price}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROFILE</Text>
        <View style={styles.coinsChip}>
          <Text style={styles.coinsText}>💰 {profile.coins}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar Hero */}
        <View style={styles.hero}>
          <AvatarBadge profile={profile} size={88} />
          <View style={styles.nameRow}>
            {editingName ? (
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                onBlur={handleSaveName}
                onSubmitEditing={handleSaveName}
                autoFocus
                maxLength={16}
                selectTextOnFocus
              />
            ) : (
              <TouchableOpacity onPress={() => { setNameInput(profile.name); setEditingName(true); }} style={styles.nameTouch}>
                <Text style={styles.nameText}>{profile.name}</Text>
                <Text style={styles.editIcon}> ✏️</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.skinLabel}>{activeSkin.name} skin</Text>
        </View>

        {/* Notice */}
        {notice && (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'GAMES', value: profile.stats.gamesPlayed },
            { label: 'WINS',  value: profile.stats.wins },
            { label: 'W/R',   value: `${winRate}%` },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Skins */}
        <Text style={styles.sectionTitle}>SKINS</Text>
        <FlatList
          data={SKINS_CATALOG}
          renderItem={renderSkinCard}
          keyExtractor={s => s.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skinsList}
        />

        {/* Edit Avatar (coming soon) */}
        <TouchableOpacity style={styles.comingSoonBtn} disabled>
          <Text style={styles.comingSoonText}>🎨  Edit Avatar  —  Coming Soon</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080E14' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1C2E42',
  },
  backBtn: { padding: 4 },
  backText: { color: '#5A7A8A', fontSize: 15 },
  headerTitle: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  coinsChip: {
    backgroundColor: '#1C2E42',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  coinsText: { color: '#FFD700', fontSize: 13, fontWeight: '700' },

  scroll: { paddingBottom: 40 },

  hero: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
  nameRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  nameTouch: { flexDirection: 'row', alignItems: 'center' },
  nameText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  editIcon: { fontSize: 16 },
  nameInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#00E5CC',
    paddingHorizontal: 4,
    paddingBottom: 2,
    minWidth: 120,
    textAlign: 'center',
  },
  skinLabel: { marginTop: 6, color: '#5A7A8A', fontSize: 12, letterSpacing: 1 },

  notice: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: '#CC330033',
    borderWidth: 1,
    borderColor: '#CC3300',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  noticeText: { color: '#FF8C8C', fontSize: 13, textAlign: 'center' },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 32,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0C1620',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1C2E42',
    paddingVertical: 14,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 22,
    color: '#FFFFFF',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 10,
    color: '#5A7A8A',
    letterSpacing: 1,
  },

  sectionTitle: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 11,
    color: '#5A7A8A',
    letterSpacing: 3,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  skinsList: { paddingHorizontal: 24, gap: 10 },
  skinCard: {
    width: 90,
    backgroundColor: '#0C1620',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1C2E42',
    padding: 10,
    alignItems: 'center',
  },
  skinCardEquipped: { borderColor: '#00E5CC', borderWidth: 2 },
  skinPreview: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 8,
  },
  skinName: { fontSize: 11, color: '#FFFFFF', fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  rarityChip: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginBottom: 6,
  },
  rarityText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  equippedBadge: {
    backgroundColor: '#00E5CC22',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  equippedText: { fontSize: 9, color: '#00E5CC', fontWeight: '700' },
  ownedText: { fontSize: 9, color: '#5A7A8A' },
  priceChip: {
    backgroundColor: '#FFD70022',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceChipLocked: { backgroundColor: '#33333333' },
  priceText: { fontSize: 9, color: '#FFD700', fontWeight: '700' },
  priceTextLocked: { color: '#556677' },

  comingSoonBtn: {
    marginHorizontal: 24,
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1C2E42',
    alignItems: 'center',
    opacity: 0.5,
  },
  comingSoonText: { color: '#5A7A8A', fontSize: 14 },
});
