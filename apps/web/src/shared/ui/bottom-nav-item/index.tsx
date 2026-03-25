import { NavLink } from "react-router-dom";

import { cn } from "@/shared/lib/cn";
import { Icon, type IconName } from "@/shared/ui/icons";
import styles from "./index.module.css";

interface BottomNavItemProps {
  to: string;
  label: string;
  icon: IconName;
}

export function BottomNavItem({ icon, label, to }: BottomNavItemProps) {
  return (
    <NavLink
      className={({ isActive }) => cn(styles.link, isActive && styles.linkActive)}
      to={to}
    >
      <Icon
        className={styles.icon}
        name={icon}
        size={16}
        tone="muted"
      />
      <span>{label}</span>
    </NavLink>
  );
}
