import { MetaText } from "@/shared/ui/typography";
import { useCopy } from "@/app/providers/language-provider";
import styles from "./index.module.css";

export type SearchSortOption = "relevance" | "date";

interface SearchSortControlProps {
  sortBy: SearchSortOption;
  onSortChange: (sort: SearchSortOption) => void;
}

export function SearchSortControl({ sortBy, onSortChange }: SearchSortControlProps) {
  const copy = useCopy();

  return (
    <div className={styles.sortControl}>
      <MetaText className={styles.sortLabel}>{copy.search.sortLabel}</MetaText>
      <button
        className={`${styles.sortButton} ${sortBy === "relevance" ? styles.sortButtonActive : ""}`}
        onClick={() => onSortChange("relevance")}
        type="button"
      >
        {copy.search.sortByRelevance}
      </button>
      <button
        className={`${styles.sortButton} ${sortBy === "date" ? styles.sortButtonActive : ""}`}
        onClick={() => onSortChange("date")}
        type="button"
      >
        {copy.search.sortByDate}
      </button>
    </div>
  );
}
