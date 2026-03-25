import styles from "./index.module.css";

interface ProjectBadgeProps {
  color: string;
  label?: string;
}

export function ProjectBadge({ color, label }: ProjectBadgeProps) {
  return (
    <span className={styles.badge}>
      <span
        aria-hidden="true"
        className={styles.dot}
        style={{ backgroundColor: color }}
      />
      {label == null ? null : <span className={styles.label}>{label}</span>}
    </span>
  );
}
