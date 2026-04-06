import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCopy } from '@mindflow/copy';
import type { AppLanguage } from '@mindflow/copy';

import { useTheme } from '@shared/theme/use-theme';
import { useThemeContext } from '@shared/theme/theme-context';
import { useAuthStore } from '@shared/model/auth-store';
import { resolveInitialLanguage, setStoredLanguage } from '@shared/lib/language';
import { getThemeOptions, getLanguageOptions } from '@shared/lib/settings-options';
import { Icon } from '@shared/ui/icons';
import { BottomSheetSelector } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

type AuthMode = 'sign-in' | 'sign-up';

// ─── FieldRow ─────────────────────────────────────────────────────────────────

interface FieldRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoComplete?: TextInput['props']['autoComplete'];
  keyboardType?: TextInput['props']['keyboardType'];
  autoCapitalize?: TextInput['props']['autoCapitalize'];
}

function FieldRow({
  label,
  value,
  onChange,
  placeholder,
  secureTextEntry = false,
  autoComplete,
  keyboardType,
  autoCapitalize = 'none',
}: FieldRowProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Meta tone="soft">{label}</Meta>
      <View
        style={[
          styles.inputRow,
          {
            borderColor: theme.colors.borderSoft,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={secureTextEntry && !visible}
          style={[styles.input, { color: theme.colors.textPrimary }]}
          value={value}
          onChangeText={onChange}
        />
        {secureTextEntry ? (
          <Pressable
            style={styles.eyeButton}
            onPress={() => { setVisible(v => !v); }}
          >
            <Icon decorative name={visible ? 'eye-off' : 'eye'} size={18} tone="muted" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// ─── AuthScreen ───────────────────────────────────────────────────────────────

export function AuthScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { themeName, setTheme } = useThemeContext();

  const signIn = useAuthStore(s => s.actions.signIn);
  const signUp = useAuthStore(s => s.actions.signUp);

  // Language is managed locally — AppStoreProvider not yet mounted
  const [language, setLanguageState] = useState<AppLanguage>(() =>
    resolveInitialLanguage(),
  );
  const copy = useMemo(() => getCopy(language), [language]);

  const themeOptions = useMemo(() => getThemeOptions(copy), [copy]);
  const languageOptions = useMemo(() => getLanguageOptions(copy), [copy]);

  function handleSetLanguage(lang: AppLanguage) {
    setStoredLanguage(lang);
    setLanguageState(lang);
  }

  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchMode(next: AuthMode) {
    setMode(next);
    setSubmitError(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit() {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      if (mode === 'sign-in') {
        await signIn(email, password);
      } else {
        await signUp(name, email, password, confirmPassword);
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : copy.common.unexpectedLocalDataError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Heading */}
          <View style={styles.heading}>
            <Body
              weight="semibold"
              style={[styles.title, { color: colors.textPrimary, textAlign: 'center' }]}
            >
              {copy.auth.title}
            </Body>
            <Meta style={{ textAlign: 'center' }} tone="secondary">
              {copy.auth.subtitle}
            </Meta>
          </View>

          {/* Card */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.borderSoft },
            ]}
          >
            {/* Mode tabs */}
            <View style={[styles.tabs, { backgroundColor: colors.background }]}>
              {(['sign-in', 'sign-up'] as AuthMode[]).map(m => (
                <Pressable
                  key={m}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: mode === m }}
                  style={[
                    styles.tab,
                    mode === m && [styles.tabActive, { backgroundColor: colors.surface }],
                  ]}
                  onPress={() => { switchMode(m); }}
                >
                  <Body weight="medium" tone={mode === m ? 'primary' : 'secondary'}>
                    {m === 'sign-in' ? copy.auth.signInTab : copy.auth.signUpTab}
                  </Body>
                </Pressable>
              ))}
            </View>

            {/* Fields */}
            <View style={styles.fields}>
              {mode === 'sign-up' ? (
                <FieldRow
                  autoCapitalize="words"
                  autoComplete="name"
                  label={copy.auth.nameLabel}
                  placeholder={copy.auth.namePlaceholder}
                  value={name}
                  onChange={setName}
                />
              ) : null}

              <FieldRow
                autoComplete="email"
                keyboardType="email-address"
                label={copy.auth.emailLabel}
                placeholder={copy.auth.emailPlaceholder}
                value={email}
                onChange={setEmail}
              />

              <FieldRow
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                label={copy.auth.passwordLabel}
                placeholder={copy.auth.passwordPlaceholder}
                secureTextEntry
                value={password}
                onChange={setPassword}
              />

              {mode === 'sign-up' ? (
                <FieldRow
                  autoComplete="new-password"
                  label={copy.auth.confirmPasswordLabel}
                  placeholder={copy.auth.confirmPasswordPlaceholder}
                  secureTextEntry
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              ) : null}
            </View>

            {/* Error */}
            {submitError != null ? (
              <Meta style={{ color: colors.accentAlert }}>{submitError}</Meta>
            ) : null}

            {/* Submit */}
            <Pressable
              disabled={isSubmitting}
              style={[
                styles.submitButton,
                { backgroundColor: colors.accentPrimary },
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={() => { void handleSubmit(); }}
            >
              <Body weight="semibold" style={{ color: colors.background }}>
                {mode === 'sign-in' ? copy.auth.signInSubmit : copy.auth.signUpSubmit}
              </Body>
            </Pressable>
          </View>

          {/* Settings: theme + language */}
          <View style={styles.settingsSection}>
            <BottomSheetSelector
              icon="palette"
              triggerLabel={copy.theme.label}
              currentLabel={themeOptions.find(t => t.value === themeName)?.label ?? ''}
              options={themeOptions}
              value={themeName}
              onSelect={setTheme}
              sheetTitle={copy.theme.label}
            />
            <BottomSheetSelector
              icon="language"
              triggerLabel={copy.language.label}
              currentLabel={languageOptions.find(l => l.value === language)?.label ?? ''}
              options={languageOptions}
              value={language}
              onSelect={handleSetLanguage}
              sheetTitle={copy.language.label}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  heading: { gap: 4, alignItems: 'center' },
  title: { fontSize: 20 },
  card: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {},
  fields: { gap: 12 },
  fieldGroup: { gap: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 44,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
  },
  eyeButton: { padding: 4 },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.5 },
  settingsSection: { gap: 4 },
});
