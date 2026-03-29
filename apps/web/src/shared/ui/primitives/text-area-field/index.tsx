import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

export function TextAreaField(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;

  return <textarea {...rest} className={cn(styles.field, styles.textareaField, className)} />;
}
