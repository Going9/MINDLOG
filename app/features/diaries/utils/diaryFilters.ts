import type { DiaryEntry, EmotionTag } from "../types/diary";

export function applySearchFilter(
  diaries: DiaryEntry[],
  searchQuery: string
): DiaryEntry[] {
  if (!searchQuery.trim()) {
    return diaries;
  }

  const query = searchQuery.toLowerCase();
  return diaries.filter(entry => {
    return (
      entry.shortContent?.toLowerCase().includes(query) ||
      entry.situation?.toLowerCase().includes(query) ||
      entry.reaction?.toLowerCase().includes(query)
    );
  });
}

export function applySortFilter(
  diaries: DiaryEntry[],
  sortBy: string
): DiaryEntry[] {
  const sorted = [...diaries];
  
  switch (sortBy) {
    case "date-asc":
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case "date-desc":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case "completion-asc":
      return sorted.sort((a, b) => (a.completedSteps / a.totalSteps) - (b.completedSteps / b.totalSteps));
    case "completion-desc":
      return sorted.sort((a, b) => (b.completedSteps / b.totalSteps) - (a.completedSteps / a.totalSteps));
    default:
      return sorted;
  }
}

export function applyEmotionFilter(
  diaries: DiaryEntry[],
  emotionTag?: EmotionTag
): DiaryEntry[] {
  if (!emotionTag) {
    return diaries;
  }

  return diaries.filter(entry => 
    entry.emotionTags.some(tag => tag.id === emotionTag.id)
  );
}

export function applyCompletionFilter(
  diaries: DiaryEntry[],
  completionFilter: string
): DiaryEntry[] {
  if (completionFilter === "complete") {
    return diaries.filter(entry => entry.completedSteps === entry.totalSteps);
  }
  
  if (completionFilter === "incomplete") {
    return diaries.filter(entry => entry.completedSteps < entry.totalSteps);
  }
  
  return diaries;
}

export function applyDateFilter(
  diaries: DiaryEntry[],
  selectedDate?: Date
): DiaryEntry[] {
  if (!selectedDate) {
    return diaries;
  }

  const targetDateString = selectedDate.toISOString().split("T")[0];
  
  return diaries.filter(entry => {
    const entryDateString = entry.date;
    return entryDateString === targetDateString;
  });
}

export function applyAllFilters(
  diaries: DiaryEntry[],
  filters: {
    searchQuery: string;
    sortBy: string;
    emotionTag?: EmotionTag;
    completionFilter: string;
    selectedDate?: Date;
  }
): DiaryEntry[] {
  let filtered = diaries;
  
  // Apply filters in sequence
  filtered = applySearchFilter(filtered, filters.searchQuery);
  filtered = applyEmotionFilter(filtered, filters.emotionTag);
  filtered = applyCompletionFilter(filtered, filters.completionFilter);
  filtered = applyDateFilter(filtered, filters.selectedDate);
  
  // Apply sorting last
  filtered = applySortFilter(filtered, filters.sortBy);
  
  return filtered;
}