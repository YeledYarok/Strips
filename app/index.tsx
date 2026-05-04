import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getTodayMg, getTodayStripes, formatMg } from '../src/storage';

export default function HomeScreen() {
  const [totalMg, setTotalMg] = useState(0);
  const [stripeCount, setStripeCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setTotalMg(await getTodayMg());
        setStripeCount((await getTodayStripes()).length);
      })();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>Stripes</Text>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => router.push('/settings')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.moreDots}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* mg counter — the only addition to the original design */}
      <View style={styles.counterArea}>
        <Text style={styles.counter}>{formatMg(totalMg)}</Text>
        <Text style={styles.subtitle}>consumed today</Text>
        {stripeCount > 0 && (
          <Text style={styles.stripeCount}>
            {stripeCount} {stripeCount === 1 ? 'stripe' : 'stripes'}
          </Text>
        )}
      </View>

      {/* Powder pile — tap to go to mirror / log a stripe */}
      <TouchableOpacity
        style={styles.pileContainer}
        onPress={() => router.push('/mirror')}
        activeOpacity={0.7}
      >
        <View style={styles.pileInner} />
        <View style={styles.pileBase} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 2,
  },
  moreBtn: {
    position: 'absolute',
    right: 24,
  },
  moreDots: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: 3,
  },
  counterArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    color: '#fff',
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#555',
    fontSize: 13,
    marginTop: 8,
    letterSpacing: 1,
  },
  stripeCount: {
    color: '#333',
    fontSize: 12,
    marginTop: 6,
  },
  pileContainer: {
    alignItems: 'center',
    paddingBottom: 50,
    gap: 0,
  },
  pileInner: {
    width: 260,
    height: 14,
    backgroundColor: '#d8d8d8',
    borderRadius: 100,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  pileBase: {
    width: 340,
    height: 8,
    backgroundColor: '#b0b0b0',
    borderRadius: 100,
    marginTop: -4,
    opacity: 0.6,
  },
});
