import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Body, SectionTitleText } from '../../typography';

interface BottomSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  headerAccessory?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 16,
  },
  sheetHandle: {
    width: 52,
    height: 6,
    borderRadius: 999,
    alignSelf: 'center',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  sheetHeaderText: {
    flex: 1,
    gap: 4,
  },
});

export function BottomSheet({
  visible,
  title,
  subtitle,
  headerAccessory,
  children,
  onClose,
}: BottomSheetProps) {
  const { theme } = useTheme();

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <Pressable
          onPress={onClose}
          style={[styles.modalScrim, { backgroundColor: theme.colors.overlayScrim }]}
        />
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderSoft },
          ]}
        >
          <View style={[styles.sheetHandle, { backgroundColor: theme.colors.overlayHandle }]} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderText}>
              <SectionTitleText>{title}</SectionTitleText>
              {subtitle ? <Body tone="secondary">{subtitle}</Body> : null}
            </View>
            {headerAccessory}
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export type { BottomSheetProps };
