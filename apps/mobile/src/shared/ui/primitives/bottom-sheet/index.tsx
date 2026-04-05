import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

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

const SNAP_POINTS = ['75%'];

export function BottomSheet({
  visible,
  title,
  subtitle,
  headerAccessory,
  children,
  onClose,
}: BottomSheetProps) {
  const { theme } = useTheme();
  const ref = useRef<{ present: () => void; dismiss: () => void }>(null);

  useEffect(() => {
    if (visible) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        presenceAnimated
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={SNAP_POINTS}
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={[
        styles.background,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.borderSoft,
        },
      ]}
      handleIndicatorStyle={[
        styles.handle,
        { backgroundColor: theme.colors.overlayHandle },
      ]}
      enablePanDownToClose
    >
      <BottomSheetScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheetHeader}>
          <View style={styles.sheetHeaderText}>
            <SectionTitleText>{title}</SectionTitleText>
            {subtitle ? <Body tone="secondary">{subtitle}</Body> : null}
          </View>
          {headerAccessory}
        </View>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

export type { BottomSheetProps };

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  handle: {
    width: 52,
    height: 6,
    borderRadius: 999,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 16,
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
