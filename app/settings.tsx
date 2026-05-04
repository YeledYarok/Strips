import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { getSettings, saveSettings, formatMg } from '../src/storage';

export default function SettingsScreen() {
  const [mgPerStripe, setMgPerStripe] = useState(500);

  useEffect(() => {
    getSettings().then((s) => setMgPerStripe(s.mgPerStripe));
  }, []);

  const handleDone = async () => {
    await saveSettings({ mgPerStripe });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Value display */}
      <View style={styles.valueArea}>
        <Text style={styles.value}>{formatMg(mgPerStripe)}</Text>
        <Text style={styles.valueLabel}>mg per stripe</Text>
      </View>

      {/* Slider */}
      <View style={styles.sliderArea}>
        <Slider
          style={styles.slider}
          minimumValue={100}
          maximumValue={2000}
          step={50}
          value={mgPerStripe}
          onValueChange={setMgPerStripe}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#333"
          thumbTintColor="#fff"
        />
        <View style={styles.rangeRow}>
          <Text style={styles.rangeLabel}>100 mg</Text>
          <Text style={styles.rangeLabel}>2 000 mg</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Each stripe you log will count as this amount.
      </Text>

      {/* Done */}
      <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
        <Text style={styles.doneBtnText}>Done</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  backBtn: {
    position: 'absolute',
    left: 24,
  },
  backChevron: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  valueArea: {
    alignItems: 'center',
    marginTop: 80,
  },
  value: {
    color: '#fff',
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
  },
  valueLabel: {
    color: '#555',
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 1,
  },
  sliderArea: {
    marginTop: 60,
    paddingHorizontal: 24,
  },
  slider: {
    width: '100%',
    height: 44,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    color: '#444',
    fontSize: 11,
  },
  description: {
    color: '#444',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 40,
  },
  doneBtn: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  doneBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
});
