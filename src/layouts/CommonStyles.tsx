import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  centerControls: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  spacer: { flex: 1 },
  bottomMinimal: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 8 },
});
