import type { SelectHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";
import styles from "./primitives.module.css";

export function SelectField(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;

  return <select {...rest} className={cn(styles.field, className)} />;
}
