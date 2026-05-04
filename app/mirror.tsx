import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getSettings, logStripe, formatMg } from '../src/storage';

const MIN_MG = 100;
const MAX_MG = 2000;

function stripeSize(mg: number) {
  const ratio = (mg - MIN_MG) / (MAX_MG - MIN_MG); // 0→1
  return {
    widthPct: 0.3 + ratio * 0.35,  // 30% → 65% of screen width
    height: 2 + ratio * 10,         // 2px → 12px
  };
}

export default function MirrorScreen() {
  const { width } = useWindowDimensions();
  const [mgPerStripe, setMgPerStripe] = useState(500);
  const [logged, setLogged] = useState(false);
  const [darkSurface, setDarkSurface] = useState(true);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    getSettings().then((s) => setMgPerStripe(s.mgPerStripe));

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const handleLog = useCallback(async () => {
    if (logged) return;
    await logStripe(mgPerStripe);
    setLogged(true);
    setTimeout(() => router.back(), 800);
  }, [logged, mgPerStripe]);

  const surfaceBg = darkSurface ? '#060606' : '#1a1a1a';

  return (
    <View style={[styles.container, { backgroundColor: surfaceBg }]}>
      {/* Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <Text style={styles.backChevron}>‹</Text>
      </TouchableOpacity>

      {/* Surface toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>dark surface</Text>
        <TouchableOpacity
          style={[styles.toggle, darkSurface && styles.toggleOn]}
          onPress={() => setDarkSurface((v) => !v)}
          activeOpacity={0.8}
        >
          <View style={[styles.toggleThumb, darkSurface && styles.toggleThumbOn]} />
        </TouchableOpacity>
      </View>

      {/* Stripe area */}
      <View style={styles.stripeArea}>
        <Text style={styles.stripeLabel}>
          {logged ? '✓ logged' : `1 stripe = ${formatMg(mgPerStripe)}`}
        </Text>
        <View
          style={[
            styles.stripe,
            {
              width: width * stripeSize(mgPerStripe).widthPct,
              height: stripeSize(mgPerStripe).height,
              borderRadius: stripeSize(mgPerStripe).height / 2,
            },
            logged && styles.stripeLogged,
          ]}
        />
      </View>

      {/* Log button */}
      {!logged && (
        <TouchableOpacity
          style={styles.logBtn}
          onPress={handleLog}
          activeOpacity={0.85}
        >
          <Text style={styles.logBtnText}>Log Stripe</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060606',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 28,
    zIndex: 10,
  },
  backChevron: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  toggleRow: {
    position: 'absolute',
    top: 44,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  toggleLabel: {
    color: '#444',
    fontSize: 11,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#222',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: '#444',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#666',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  stripeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  stripeLabel: {
    color: '#666',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  stripe: {
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  stripeLogged: {
    opacity: 0.3,
  },
  logBtn: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  logBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
