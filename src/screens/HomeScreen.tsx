import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import AvatarBadge from '../components/AvatarBadge';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { setGameMode, resetGame } = useGameStore();
  const { p1, p2 } = useProfileStore();

  const startGame = (mode: 'pass-and-play' | 'vs-ai') => {
    setGameMode(mode);
    resetGame();
    navigation.navigate('Game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>DRIFT</Text>
        <Text style={styles.subtitle}>Sliding Tic-Tac-Toe</Text>

        <View style={styles.rule}>
          <Text style={styles.ruleText}>Get 4 in a row to win</Text>
          <Text style={styles.ruleText}>After 5 pieces — oldest is removed</Text>
          <Text style={styles.ruleText}>Amber ring marks the next to go</Text>
        </View>

        {/* Player profile cards */}
        <View style={styles.profileRow}>
          <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile', { playerSlot: 'p1' })}>
            <AvatarBadge profile={p1} size={48} />
            <Text style={styles.profileName} numberOfLines={1}>{p1.name}</Text>
            <Text style={styles.profileEdit}>✏️ Edit</Text>
          </TouchableOpacity>

          <Text style={styles.vsText}>VS</Text>

          <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('Profile', { playerSlot: 'p2' })}>
            <AvatarBadge profile={p2} size={48} />
            <Text style={styles.profileName} numberOfLines={1}>{p2.name}</Text>
            <Text style={styles.profileEdit}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buttonOuter} onPress={() => startGame('pass-and-play')} activeOpacity={0.8}>
          <LinearGradient colors={['#C0392B', '#8B1A1A']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.buttonText}>🎮 Play with a Friend</Text>
            <Text style={styles.buttonSub}>Same device</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOuter} onPress={() => startGame('vs-ai')} activeOpacity={0.8}>
          <LinearGradient colors={['#2C4A6B', '#1A3050']} style={styles.button} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.buttonText}>🤖 vs AI</Text>
            <Text style={styles.buttonSub}>Challenge the computer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F3EE' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  title: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 64,
    color: '#2C1810',
    letterSpacing: 8,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: 'Orbitron_400Regular',
    fontSize: 11,
    color: '#7A5C46',
    marginBottom: 24,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  rule: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8DDD0',
    backgroundColor: '#FFFFFF',
  },
  ruleText: { color: '#7A5C46', fontSize: 13, marginBottom: 3, textAlign: 'center' },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },
  profileCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DDD0',
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  profileName: { color: '#2C1810', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  profileEdit: { color: '#B09A87', fontSize: 10 },
  vsText: {
    fontFamily: 'Orbitron_900Black',
    fontSize: 13,
    color: '#B09A87',
    letterSpacing: 2,
    paddingHorizontal: 4,
  },

  buttonOuter: { borderRadius: 12, width: '100%', marginBottom: 14, overflow: 'hidden' },
  button: { paddingVertical: 18, paddingHorizontal: 32, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  buttonSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
});
