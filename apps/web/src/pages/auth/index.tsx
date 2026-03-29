import { useMemo, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { getAuthRedirectTarget } from "@/app/app-routing";
import { useAuth } from "@/app/providers/auth-provider";
import { useCopy } from "@/app/providers/language-provider";
import { LanguageToggle } from "@/app/ui/language-toggle";
import { ThemeToggle } from "@/app/ui/theme-toggle";
import { cn } from "@/shared/lib/cn";
import { Display, Icon, MetaText, SupportText } from "@/shared/ui";
import { ActionButton, SurfaceCard, TextField } from "@/shared/ui/primitives";
import styles from "./index.module.css";

type AuthMode = "sign-in" | "sign-up";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const copy = useCopy();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isHydrated, signIn, signUp } = useAuth();
  const redirectTo = useMemo(() => getAuthRedirectTarget(location.state), [location.state]);

  if (!isHydrated) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/inbox" />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign-in") {
        await signIn(email, password);
      } else {
        await signUp(name, email, password, confirmPassword);
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : copy.common.unexpectedLocalDataError
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <ThemeToggle />
        <LanguageToggle />
      </div>
      <main className={styles.main}>
        <div className={styles.cardWrap}>
          <SurfaceCard>
            <div className={styles.card}>
              <div className={styles.heading}>
                <Display as="h1" className={styles.title}>
                  {copy.auth.title}
                </Display>
                <SupportText className={styles.subtitle}>
                  {copy.auth.subtitle}
                </SupportText>
              </div>

              <div className={styles.formPanel}>
                <div className={styles.modeToggle} role="tablist">
                  <button
                    aria-selected={mode === "sign-in"}
                    className={cn(
                      styles.modeButton,
                      mode === "sign-in" && styles.modeButtonActive
                    )}
                    onClick={() => {
                      setMode("sign-in");
                      setSubmitError(null);
                    }}
                    role="tab"
                    type="button"
                  >
                    {copy.auth.signInTab}
                  </button>
                  <button
                    aria-selected={mode === "sign-up"}
                    className={cn(
                      styles.modeButton,
                      mode === "sign-up" && styles.modeButtonActive
                    )}
                    onClick={() => {
                      setMode("sign-up");
                      setSubmitError(null);
                    }}
                    role="tab"
                    type="button"
                  >
                    {copy.auth.signUpTab}
                  </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div
                    className={cn(
                      styles.fields,
                      mode === "sign-up" && styles.fieldsSignup
                    )}
                  >
                    {mode === "sign-up" ? (
                      <label className={styles.fieldGroup}>
                        <MetaText className={styles.fieldLabel}>{copy.auth.nameLabel}</MetaText>
                        <TextField
                          autoComplete="name"
                          className={styles.input}
                          onChange={(event) => setName(event.target.value)}
                          placeholder={copy.auth.namePlaceholder}
                          type="text"
                          value={name}
                        />
                      </label>
                    ) : null}

                    <label className={styles.fieldGroup}>
                      <MetaText className={styles.fieldLabel}>{copy.auth.emailLabel}</MetaText>
                      <TextField
                        autoComplete="email"
                        className={styles.input}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={copy.auth.emailPlaceholder}
                        type="email"
                        value={email}
                      />
                    </label>

                    <label
                      className={cn(
                        styles.fieldGroup,
                        mode === "sign-in" && styles.fieldFull
                      )}
                    >
                      <MetaText className={styles.fieldLabel}>
                        {copy.auth.passwordLabel}
                      </MetaText>
                      <TextField
                        autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                        className={cn(styles.input, styles.passwordInput)}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={copy.auth.passwordPlaceholder}
                        type={isPasswordVisible ? "text" : "password"}
                        value={password}
                      />
                      <button
                        aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
                        className={styles.passwordToggle}
                        onClick={() => setIsPasswordVisible((current) => !current)}
                        type="button"
                      >
                        <Icon
                          decorative
                          name={isPasswordVisible ? "eye-off" : "eye"}
                          size={18}
                          tone="muted"
                        />
                      </button>
                    </label>

                    {mode === "sign-up" ? (
                      <label className={styles.fieldGroup}>
                        <MetaText className={styles.fieldLabel}>
                          {copy.auth.confirmPasswordLabel}
                        </MetaText>
                        <TextField
                          autoComplete="new-password"
                          className={cn(styles.input, styles.passwordInput)}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          placeholder={copy.auth.confirmPasswordPlaceholder}
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          value={confirmPassword}
                        />
                        <button
                          aria-label={
                            isConfirmPasswordVisible ? "Скрыть пароль" : "Показать пароль"
                          }
                          className={styles.passwordToggle}
                          onClick={() =>
                            setIsConfirmPasswordVisible((current) => !current)
                          }
                          type="button"
                        >
                          <Icon
                            decorative
                            name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                            size={18}
                            tone="muted"
                          />
                        </button>
                      </label>
                    ) : null}
                  </div>

                  {submitError != null ? (
                    <SupportText className={styles.error}>{submitError}</SupportText>
                  ) : null}

                  <ActionButton
                    className={styles.submitButton}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {mode === "sign-in" ? copy.auth.signInSubmit : copy.auth.signUpSubmit}
                  </ActionButton>
                </form>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </main>
    </div>
  );
}
