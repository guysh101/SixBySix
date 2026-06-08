import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerProfile, createDefaultProfile, getSkin } from '../types/profile';

interface ProfileState {
  p1: PlayerProfile;
  p2: PlayerProfile;
  updateName: (slot: 'p1' | 'p2', name: string) => void;
  equipSkin: (slot: 'p1' | 'p2', skinId: string) => void;
  buySkin: (slot: 'p1' | 'p2', skinId: string) => boolean;
  recordResult: (winner: 'p1' | 'p2' | null, mode: 'pass-and-play' | 'vs-ai') => void;
}

function coinReward(isWinner: boolean, isDraw: boolean, isVsAi: boolean): number {
  if (isDraw) return 5;
  if (isWinner) return isVsAi ? 15 : 25;
  return 10;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      p1: createDefaultProfile('p1'),
      p2: createDefaultProfile('p2'),

      updateName: (slot, name) =>
        set(state => ({ [slot]: { ...state[slot], name: name.trim() || state[slot].name } })),

      equipSkin: (slot, skinId) =>
        set(state => {
          const profile = state[slot];
          if (!profile.unlockedSkinIds.includes(skinId)) return state;
          return { [slot]: { ...profile, activeSkinId: skinId } };
        }),

      buySkin: (slot, skinId) => {
        const profile = get()[slot];
        const skin = getSkin(skinId);
        if (!skin.price || profile.coins < skin.price) return false;
        if (profile.unlockedSkinIds.includes(skinId)) return false;
        set(state => ({
          [slot]: {
            ...state[slot],
            coins: state[slot].coins - skin.price!,
            unlockedSkinIds: [...state[slot].unlockedSkinIds, skinId],
            activeSkinId: skinId,
          },
        }));
        return true;
      },

      recordResult: (winner, mode) =>
        set(state => {
          const isDraw = winner === null;
          const updatePlayer = (slot: 'p1' | 'p2'): PlayerProfile => {
            if (mode === 'vs-ai' && slot === 'p2') return state[slot];
            const isWinner = winner === slot;
            return {
              ...state[slot],
              coins: state[slot].coins + coinReward(isWinner, isDraw, mode === 'vs-ai'),
              stats: {
                gamesPlayed: state[slot].stats.gamesPlayed + 1,
                wins: state[slot].stats.wins + (isWinner ? 1 : 0),
                losses: state[slot].stats.losses + (!isDraw && !isWinner ? 1 : 0),
                draws: state[slot].stats.draws + (isDraw ? 1 : 0),
              },
            };
          };
          return { p1: updatePlayer('p1'), p2: updatePlayer('p2') };
        }),
    }),
    {
      name: 'sixbysix-profiles',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
