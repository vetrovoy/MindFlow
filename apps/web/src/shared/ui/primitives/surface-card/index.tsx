import type { CSSProperties, ReactNode } from "react";

import styles from "./index.module.css";

export interface SurfaceCardProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function SurfaceCard({ children, style }: SurfaceCardProps) {
  return (
    <section className={styles.surfaceCard} style={style}>
      {children}
    </section>
  );
}
