import { StyleSheet } from 'react-native';

export const layoutStyles = StyleSheet.create({
  topControls: { flex: 1 },
  centerControls: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomControls: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  column: { flexDirection: 'column' },
  spacer: { flex: 1 },
  bottomMinimal: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 8 },
});
