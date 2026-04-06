import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast, { type ToastConfig } from 'react-native-toast-message';

import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { Body, Title } from '@shared/ui/typography';

import { TOAST_DURATION_MS } from '@mobile/shared/config/constants';

function ToastContent({
  text1,
  text2,
  icon,
  tint,
  backgroundColor,
}: {
  text1?: string;
  text2?: string;
  icon: React.ReactNode;
  tint: string;
  backgroundColor?: string;
}) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: backgroundColor || undefined },
      ]}
    >
      {icon}
      <View style={styles.textContainer}>
        {text1 ? <Title style={{ color: tint }}>{text1}</Title> : null}
        {text2 ? <Body tone="secondary">{text2}</Body> : null}
      </View>
    </View>
  );
}

/**
 * Themed toast provider — reads current theme and renders
 * custom toast content for success / error / info types.
 */
export function AppToast() {
  const { theme } = useTheme();

  const config: ToastConfig = React.useMemo(
    () => ({
      success: ({ text1, text2 }) => (
        <ToastContent
          text1={text1}
          text2={text2}
          backgroundColor={theme.colors.overlayScrim}
          tint={theme.colors.accentPrimary}
          icon={<Icon tone="accent" name="toast-success" size={22} />}
        />
      ),
      error: ({ text1, text2 }) => (
        <ToastContent
          text1={text1}
          text2={text2}
          backgroundColor={theme.colors.overlayScrim}
          tint={theme.colors.accentAlert}
          icon={<Icon tone="alert" name="close" size={22} />}
        />
      ),
      info: ({ text1, text2 }) => (
        <ToastContent
          text1={text1}
          text2={text2}
          backgroundColor={theme.colors.overlayScrim}
          tint={theme.colors.accentInfo}
          icon={<Icon tone="muted" name="nav-inbox" size={22} />}
        />
      ),
    }),
    [theme],
  );

  return (
    <Toast
      config={config}
      visibilityTime={TOAST_DURATION_MS}
      position="top"
      topOffset={80}
      keyboardOffset={16}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
});
