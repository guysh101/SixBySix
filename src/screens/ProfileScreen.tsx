import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, TextInput, FlatList, Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useProfileStore } from '../store/profileStore';
import { SKINS_CATALOG, RARITY_COLORS, getSkin, Skin } from '../types/profile';
import { getSkinGemPalette, GemPalette, RARITY_HEX, Fonts } from '../theme/colors';
import SkyScene from '../components/SkyScene';
import Gem from '../components/Gem';
import Ribbon from '../components/Ribbon';
import Capsule from '../components/Capsule';
import Coin from '../components/Coin';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
  route: RouteProp<RootStackParamList, 'Profile'>;
};

// ─── Section tag ─────────────────────────────────────────────────────────────

function SectionTag({ label, style }: { label: string; style?: object }) {
  return (
    <View style={[tagStyles.wrap, style]}>
      <View style={tagStyles.line} />
      <View style={tagStyles.pill}>
        <Text style={tagStyles.text}>{label}</Text>
      </View>
      <View style={tagStyles.line} />
    </View>
  );
}

const tagStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 22, marginBottom: 14 },
  line: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' },
  pill: {
    backgroundColor: 'rgba(118,71,190,0.7)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  text: { fontFamily: Fonts.uiBold, fontSize: 11, letterSpacing: 2, color: '#FFFFFF' },
});

// ─── Skin card ────────────────────────────────────────────────────────────────

interface SkinCardProps {
  skin: Skin;
  palette: GemPalette;
  isEquipped: boolean;
  isOwned: boolean;
  canAfford: boolean;
  onPress: () => void;
}

function SkinCard({ skin, palette, isEquipped, isOwned, canAfford, onPress }: SkinCardProps) {
  const rarityColor = RARITY_HEX[skin.rarity] ?? RARITY_COLORS[skin.rarity];
  return (
    <TouchableOpacity
      style={[skinStyles.card, isEquipped && { borderColor: '#FFC93C', borderWidth: 2.5 }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Gem palette={palette} size={52} />
      <Text style={skinStyles.name}>{skin.name}</Text>

      <View style={[skinStyles.rarityChip, { borderColor: rarityColor }]}>
        <Text style={[skinStyles.rarityText, { color: rarityColor }]}>
          {skin.rarity.toUpperCase()}
        </Text>
      </View>

      {isEquipped ? (
        <View style={skinStyles.equippedBadge}><Text style={skinStyles.equippedText}>✓ ON</Text></View>
      ) : isOwned ? (
        <Text style={skinStyles.ownedText}>OWNED</Text>
      ) : (
        <View style={[skinStyles.priceRow, !canAfford && skinStyles.priceRowLocked]}>
          <Coin size={14} />
          <Text style={[skinStyles.priceText, !canAfford && skinStyles.priceTextLocked]}>
            {skin.price}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const skinStyles = StyleSheet.create({
  card: {
    width: 96,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: 10,
    alignItems: 'center',
    gap: 6,
    shadowColor: 'rgba(58,28,99,0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  name: { fontFamily: Fonts.uiBold, fontSize: 11, color: '#4A2C6E', textAlign: 'center' },
  rarityChip: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  rarityText: { fontSize: 8, fontFamily: Fonts.uiBold, letterSpacing: 0.5 },
  equippedBadge: {
    backgroundColor: '#FFC93C33',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  equippedText: { fontSize: 9, fontFamily: Fonts.uiBold, color: '#E8960C' },
  ownedText: { fontSize: 9, fontFamily: Fonts.ui, color: '#7647BE' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,201,60,0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceRowLocked: { backgroundColor: 'rgba(0,0,0,0.06)' },
  priceText: { fontSize: 9, fontFamily: Fonts.uiBold, color: '#E8960C' },
  priceTextLocked: { color: '#9AA0B2' },
});

// ─── ProfileScreen ────────────────────────────────────────────────────────────

const EYE_COUNT   = 4;
const MOUTH_COUNT = 4;

export default function ProfileScreen({ navigation, route }: Props) {
  const { playerSlot } = route.params;
  const profile = useProfileStore(s => s[playerSlot]);
  const { updateName, equipSkin, buySkin, updateAvatar } = useProfileStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState(profile.name);
  const [notice,      setNotice]      = useState<string | null>(null);

  const heroBob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(heroBob, { toValue: 1, duration: 1700, useNativeDriver: true }),
        Animated.timing(heroBob, { toValue: 0, duration: 1700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const heroBobY = heroBob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  const activeSkin    = getSkin(profile.activeSkinId);
  const profilePalette = getSkinGemPalette(profile.activeSkinId);
  const winRate = profile.stats.gamesPlayed > 0
    ? Math.round((profile.stats.wins / profile.stats.gamesPlayed) * 100)
    : 0;

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) updateName(playerSlot, trimmed);
    setEditingName(false);
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  const handleSkinPress = (skin: Skin) => {
    if (skin.id === profile.activeSkinId) return;
    if (profile.unlockedSkinIds.includes(skin.id)) {
      equipSkin(playerSlot, skin.id);
      return;
    }
    if (!skin.price) return;
    const success = buySkin(playerSlot, skin.id);
    if (!success) showNotice(`Not enough coins — need ${skin.price}`);
  };

  const renderSkinCard = ({ item: skin }: { item: Skin }) => {
    const palette   = getSkinGemPalette(skin.id);
    const isEquipped = skin.id === profile.activeSkinId;
    const isOwned    = profile.unlockedSkinIds.includes(skin.id);
    const canAfford  = skin.price ? profile.coins >= skin.price : true;
    return (
      <SkinCard
        skin={skin}
        palette={palette}
        isEquipped={isEquipped}
        isOwned={isOwned}
        canAfford={canAfford}
        onPress={() => handleSkinPress(skin)}
      />
    );
  };

  return (
    <View style={styles.root}>
      {/* Fixed sky background */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <SkyScene balloon={false} hillsHeight={130} />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <Ribbon variant="pink" fontSize={12} letterSpacing={3}>PROFILE</Ribbon>

          <View style={styles.coinChip}>
            <Coin size={18} />
            <Text style={styles.coinValue}>{profile.coins}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero section */}
          <View style={styles.hero}>
            <Animated.View style={{ transform: [{ translateY: heroBobY }] }}>
              <Gem palette={profilePalette} size={98} avatar={profile.avatar} />
            </Animated.View>

            {/* Editable name */}
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
                <TouchableOpacity
                  style={styles.nameTouch}
                  onPress={() => { setNameInput(profile.name); setEditingName(true); }}
                >
                  <Text style={styles.nameText}>{profile.name}</Text>
                  <Text style={styles.editIcon}> ✎</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.skinLabel}>{activeSkin.name} gem</Text>
          </View>

          {/* Notice toast */}
          {notice !== null && (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>{notice}</Text>
            </View>
          )}

          {/* Stats row */}
          <View style={styles.statsRow}>
            {([
              { label: 'GAMES', value: profile.stats.gamesPlayed },
              { label: 'WINS',  value: profile.stats.wins },
              { label: 'W/R',   value: `${winRate}%` },
            ] as const).map(stat => (
              <Capsule key={stat.label} style={styles.statCapsule}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Capsule>
            ))}
          </View>

          {/* Avatar section */}
          <SectionTag label="AVATAR" style={{ marginTop: 8 }} />

          {/* Eyes */}
          <View style={styles.pickerSection}>
            <Text style={styles.pickerLabel}>EYES</Text>
            <View style={styles.pickerRow}>
              {Array.from({ length: EYE_COUNT }, (_, i) => {
                const selected = profile.avatar.eyeStyle === i;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.pickerTile, selected && styles.tileSelected]}
                    onPress={() => updateAvatar(playerSlot, { eyeStyle: i })}
                    activeOpacity={0.75}
                  >
                    <Gem
                      palette={profilePalette}
                      size={46}
                      avatar={{ eyeStyle: i, mouthStyle: profile.avatar.mouthStyle }}
                    />
                    {selected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Mouths */}
          <View style={[styles.pickerSection, { marginTop: 12 }]}>
            <Text style={styles.pickerLabel}>MOUTH</Text>
            <View style={styles.pickerRow}>
              {Array.from({ length: MOUTH_COUNT }, (_, i) => {
                const selected = profile.avatar.mouthStyle === i;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.pickerTile, selected && styles.tileSelected]}
                    onPress={() => updateAvatar(playerSlot, { mouthStyle: i })}
                    activeOpacity={0.75}
                  >
                    <Gem
                      palette={profilePalette}
                      size={46}
                      avatar={{ eyeStyle: profile.avatar.eyeStyle, mouthStyle: i }}
                    />
                    {selected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Gem shop */}
          <SectionTag label="GEM SHOP" style={{ marginTop: 28 }} />
          <FlatList
            data={SKINS_CATALOG}
            renderItem={renderSkinCard}
            keyExtractor={s => s.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.skinsList}
            scrollEnabled
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFDF6',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(58,28,99,0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  backText: { fontSize: 18, color: '#4A2C6E' },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  coinValue: { fontFamily: Fonts.uiBold, fontSize: 14, color: '#4A2C6E' },

  scroll: { paddingBottom: 60 },

  hero: { alignItems: 'center', paddingTop: 28, paddingBottom: 22 },
  nameRow: { marginTop: 14 },
  nameTouch: { flexDirection: 'row', alignItems: 'center' },
  nameText: { fontFamily: Fonts.display, fontSize: 28, color: '#4A2C6E' },
  editIcon: { fontSize: 18, color: '#7647BE' },
  nameInput: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: '#4A2C6E',
    borderBottomWidth: 2,
    borderBottomColor: '#7647BE',
    paddingHorizontal: 4,
    paddingBottom: 2,
    minWidth: 120,
    textAlign: 'center',
  },
  skinLabel: { marginTop: 6, fontFamily: Fonts.ui, fontSize: 12, color: 'rgba(74,44,110,0.7)', letterSpacing: 1 },

  notice: {
    marginHorizontal: 22,
    marginBottom: 10,
    backgroundColor: 'rgba(204,51,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(204,51,0,0.5)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  noticeText: { fontFamily: Fonts.ui, color: '#CC3300', fontSize: 13, textAlign: 'center' },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 22,
    gap: 10,
    marginBottom: 24,
  },
  statCapsule: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 2 },
  statValue: { fontFamily: Fonts.display, fontSize: 22, color: '#4A2C6E' },
  statLabel: { fontFamily: Fonts.uiBold, fontSize: 9, letterSpacing: 1.5, color: '#8468AC' },

  pickerSection: { marginHorizontal: 22 },
  pickerLabel: { fontFamily: Fonts.uiBold, fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  pickerRow: { flexDirection: 'row', gap: 8 },
  pickerTile: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    padding: 6,
    alignItems: 'center',
    aspectRatio: 1,
    justifyContent: 'center',
  },
  tileSelected: {
    borderColor: '#FFC93C',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3FA72A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: { fontSize: 9, color: '#fff', fontFamily: Fonts.uiBold },

  skinsList: { paddingHorizontal: 22, gap: 10, paddingBottom: 8 },
});
