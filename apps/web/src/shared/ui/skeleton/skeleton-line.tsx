import styles from "./index.module.css";

interface SkeletonLineProps {
  width?: string;
  height?: number;
}

export function SkeletonLine({
  width = "100%",
  height = 16
}: SkeletonLineProps) {
  return <div className={styles.line} style={{ width, height }} />;
}
