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
import AvatarFace from '../components/AvatarFace';
import { useProfileStore } from '../store/profileStore';
import { SKINS_CATALOG, RARITY_COLORS, getSkin, Skin } from '../types/profile';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  route: RouteProp<RootStackParamList, 'Profile'>;
};

const EYE_LABELS = ['• •', '◉ ◉', '— —', '• —'];
const MOUTH_LABELS = ['smile', 'smirk', 'open', 'frown'];

export default function ProfileScreen({ navigation, route }: Props) {
  const { playerSlot } = route.params;
  const profile = useProfileStore(s => s[playerSlot]);
  const { updateName, equipSkin, buySkin, updateAvatar } = useProfileStore();

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
        <View style={[styles.rarityChip, { borderColor: RARITY_COLORS[skin.rarity] }]}>
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

        {/* Face Editor */}
        <Text style={styles.sectionTitle}>AVATAR</Text>

        <View style={styles.faceEditorRow}>
          {/* Live preview */}
          <View style={styles.facePreviewWrap}>
            <LinearGradient
              colors={activeSkin.colors}
              style={styles.facePreviewCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <AvatarFace config={profile.avatar} size={72} />
          </View>

          {/* Pickers */}
          <View style={styles.pickerCol}>
            <Text style={styles.pickerLabel}>EYES</Text>
            <View style={styles.pickerRow}>
              {EYE_LABELS.map((label, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.pickerBtn, profile.avatar.eyeStyle === i && styles.pickerBtnSelected]}
                  onPress={() => updateAvatar(playerSlot, { eyeStyle: i })}
                  activeOpacity={0.7}
                >
                  <View style={styles.pickerFaceWrap}>
                    <LinearGradient
                      colors={activeSkin.colors}
                      style={styles.pickerFaceCircle}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <AvatarFace config={{ eyeStyle: i, mouthStyle: profile.avatar.mouthStyle }} size={36} />
                  </View>
                  <Text style={styles.pickerBtnText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.pickerLabel, { marginTop: 12 }]}>MOUTH</Text>
            <View style={styles.pickerRow}>
              {MOUTH_LABELS.map((label, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.pickerBtn, profile.avatar.mouthStyle === i && styles.pickerBtnSelected]}
                  onPress={() => updateAvatar(playerSlot, { mouthStyle: i })}
                  activeOpacity={0.7}
                >
                  <View style={styles.pickerFaceWrap}>
                    <LinearGradient
                      colors={activeSkin.colors}
                      style={styles.pickerFaceCircle}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <AvatarFace config={{ eyeStyle: profile.avatar.eyeStyle, mouthStyle: i }} size={36} />
                  </View>
                  <Text style={styles.pickerBtnText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Skins */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SKINS</Text>
        <FlatList
          data={SKINS_CATALOG}
          renderItem={renderSkinCard}
          keyExtractor={s => s.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skinsList}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F3EE' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3D1A6B',
  },
  backBtn: { padding: 4 },
  backText: { color: '#C084FC', fontSize: 15 },
  headerTitle: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  coinsChip: {
    backgroundColor: '#1A0040',
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
    borderBottomColor: '#E879F9',
    paddingHorizontal: 4,
    paddingBottom: 2,
    minWidth: 120,
    textAlign: 'center',
  },
  skinLabel: { marginTop: 6, color: '#7C3AED', fontSize: 12, letterSpacing: 1 },

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
    backgroundColor: '#1A0040',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D1A6B',
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
    color: '#7C3AED',
    letterSpacing: 1,
  },

  sectionTitle: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 11,
    color: '#7C3AED',
    letterSpacing: 3,
    marginHorizontal: 24,
    marginBottom: 12,
  },

  // Face editor
  faceEditorRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 8,
    gap: 16,
    alignItems: 'flex-start',
  },
  facePreviewWrap: {
    width: 72,
    height: 72,
  },
  facePreviewCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'absolute',
  },
  pickerCol: { flex: 1 },
  pickerLabel: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 9,
    color: '#7C3AED',
    letterSpacing: 2,
    marginBottom: 6,
  },
  pickerRow: { flexDirection: 'row', gap: 6 },
  pickerBtn: {
    flex: 1,
    backgroundColor: '#1A0040',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3D1A6B',
    paddingVertical: 6,
    alignItems: 'center',
    gap: 4,
  },
  pickerBtnSelected: { borderColor: '#E879F9', borderWidth: 2, backgroundColor: '#2D0A6B' },
  pickerFaceWrap: { width: 36, height: 36 },
  pickerFaceCircle: { width: 36, height: 36, borderRadius: 18, position: 'absolute' },
  pickerBtnText: { fontSize: 8, color: '#7C3AED', fontWeight: '600' },

  skinsList: { paddingHorizontal: 24, gap: 10, marginBottom: 8 },
  skinCard: {
    width: 90,
    backgroundColor: '#1A0040',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D1A6B',
    padding: 10,
    alignItems: 'center',
  },
  skinCardEquipped: { borderColor: '#E879F9', borderWidth: 2 },
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
    backgroundColor: '#E879F922',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  equippedText: { fontSize: 9, color: '#E879F9', fontWeight: '700' },
  ownedText: { fontSize: 9, color: '#7C3AED' },
  priceChip: {
    backgroundColor: '#FFD70022',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceChipLocked: { backgroundColor: '#33333333' },
  priceText: { fontSize: 9, color: '#FFD700', fontWeight: '700' },
  priceTextLocked: { color: '#556677' },
});
