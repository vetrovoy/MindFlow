import { useCopy } from "@/app/providers/language-provider";
import { BottomNavItem } from "@/shared/ui";
import styles from "./index.module.css";

export function BottomNavWidget() {
  const copy = useCopy();
  const items = [
    { to: "/inbox", label: copy.navigation.inbox, icon: "nav-inbox" },
    { to: "/lists", label: copy.navigation.lists, icon: "nav-lists" },
    { to: "/today", label: copy.navigation.today, icon: "nav-today" }
  ] as const;

  return (
    <nav aria-label={copy.navigation.mainAriaLabel} className={styles.nav}>
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
