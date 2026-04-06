import { SkeletonLine } from "./skeleton-line";
import styles from "./index.module.css";

export function SkeletonTaskRow() {
  return (
    <div className={styles.row}>
      <div className={styles.checkbox} />
      <div className={styles.main}>
        <SkeletonLine width="70%" height={16} />
        <SkeletonLine width="40%" height={12} />
      </div>
    </div>
  );
}
