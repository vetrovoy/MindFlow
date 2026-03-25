import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";
import styles from "./index.module.css";

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "span" | "p" | "strong" | "div" | "h1" | "h2" | "h3";
  children: ReactNode;
}

export function Display({ as = "h1", children, className, ...rest }: TextProps) {
  const Component = as;

  return (
    <Component {...rest} className={cn(styles.display, className)}>
      {children}
    </Component>
  );
}

export function Heading({ as = "h2", children, className, ...rest }: TextProps) {
  const Component = as;

  return (
    <Component {...rest} className={cn(styles.heading, className)}>
      {children}
    </Component>
  );
}

export function Title({ as = "h3", children, className, ...rest }: TextProps) {
  const Component = as;

  return (
    <Component {...rest} className={cn(styles.title, className)}>
      {children}
    </Component>
  );
}

export function Body({ as = "p", children, className, ...rest }: TextProps) {
  const Component = as;

  return (
    <Component {...rest} className={cn(styles.body, className)}>
      {children}
    </Component>
  );
}

export function SupportText({ as = "p", children, className, ...rest }: TextProps) {
  const Component = as;

  return (
    <Component {...rest} className={cn(styles.support, className)}>
      {children}
    </Component>
  );
}

export function MetaText({ as = "span", children, className, ...rest }: TextProps) {
  const Component = as;

  return (
    <Component {...rest} className={cn(styles.meta, className)}>
      {children}
    </Component>
  );
}

export function Eyebrow({ as = "span", children, className, ...rest }: TextProps) {
  const Component = as;

  return (
    <Component {...rest} className={cn(styles.eyebrow, className)}>
      {children}
    </Component>
  );
}
