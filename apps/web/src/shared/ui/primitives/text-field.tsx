import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";
import styles from "./primitives.module.css";

export function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return <input {...rest} className={cn(styles.field, className)} />;
}
