import { BottomNavItem } from "@/shared/ui";
import styles from "./index.module.css";

const items = [
  { to: "/inbox", label: "Входящие", icon: "nav-inbox" },
  { to: "/lists", label: "Списки", icon: "nav-lists" },
  { to: "/today", label: "Сегодня", icon: "nav-today" }
] as const;

export function BottomNavWidget() {
  return (
    <nav aria-label="Основная навигация" className={styles.nav}>
      <div className={styles.pill}>
        {items.map((item) => (
          <BottomNavItem
            icon={item.icon}
            key={item.to}
            label={item.label}
            to={item.to}
          />
        ))}
      </div>
    </nav>
  );
}
