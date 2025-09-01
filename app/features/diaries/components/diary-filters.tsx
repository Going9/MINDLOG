import { Button } from "~/common/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { Input } from "~/common/components/ui/input";
import { Badge } from "~/common/components/ui/badge";
import {
  FilterIcon,
  SearchIcon,
  XIcon,
  SortAscIcon,
  SortDescIcon,
} from "lucide-react";

interface EmotionTag {
  id: number;
  name: string;
  color: string;
  category: "positive" | "negative" | "neutral";
  isDefault: boolean;
}

interface DiaryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedEmotionFilter?: EmotionTag;
  onEmotionFilterChange: (emotion?: EmotionTag) => void;
  completionFilter: string;
  onCompletionFilterChange: (completion: string) => void;
  availableEmotions: EmotionTag[];
  onClearFilters: () => void;
  totalEntries: number;
  filteredEntries: number;
}

export function DiaryFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedEmotionFilter,
  onEmotionFilterChange,
  completionFilter,
  onCompletionFilterChange,
  availableEmotions,
  onClearFilters,
  totalEntries,
  filteredEntries,
}: DiaryFiltersProps) {
  const hasActiveFilters = 
    searchQuery || 
    selectedEmotionFilter || 
    completionFilter !== "all" ||
    sortBy !== "date-desc";

  const getSortLabel = (value: string) => {
    switch (value) {
      case "date-desc":
        return "최신순";
      case "date-asc":
        return "오래된순";
      case "completion-desc":
        return "완성도 높은 순";
      case "completion-asc":
        return "완성도 낮은 순";
      default:
        return "정렬 순서";
    }
  };

  const getCompletionLabel = (value: string) => {
    switch (value) {
      case "all":
        return "전체";
      case "complete":
        return "완료된 일기";
      case "incomplete":
        return "미완료 일기";
      default:
        return "완성도";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="일기 내용 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              {sortBy.includes("desc") ? (
                <SortDescIcon className="w-4 h-4" />
              ) : (
                <SortAscIcon className="w-4 h-4" />
              )}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">최신순</SelectItem>
            <SelectItem value="date-asc">오래된순</SelectItem>
            <SelectItem value="completion-desc">완성도 높은 순</SelectItem>
            <SelectItem value="completion-asc">완성도 낮은 순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Emotion Filter */}
        <Select 
          value={selectedEmotionFilter?.id.toString() || "all"} 
          onValueChange={(value) => {
            if (value === "all") {
              onEmotionFilterChange(undefined);
            } else {
              const emotion = availableEmotions.find(e => e.id.toString() === value);
              onEmotionFilterChange(emotion);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="감정별 보기" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 감정</SelectItem>
            {availableEmotions.map((emotion) => (
              <SelectItem key={emotion.id} value={emotion.id.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  />
                  {emotion.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Completion Filter */}
        <Select value={completionFilter} onValueChange={onCompletionFilterChange}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="complete">완료됨</SelectItem>
            <SelectItem value="incomplete">미완료</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <XIcon className="w-4 h-4" />
            필터 초기화
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">활성 필터:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              검색: "{searchQuery}"
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-transparent"
                onClick={() => onSearchChange("")}
              >
                <XIcon className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          
          {selectedEmotionFilter && (
            <Badge 
              style={{ backgroundColor: selectedEmotionFilter.color }}
              className="text-white flex items-center gap-1"
            >
              {selectedEmotionFilter.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-white/20"
                onClick={() => onEmotionFilterChange(undefined)}
              >
                <XIcon className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          
          {completionFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {getCompletionLabel(completionFilter)}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-transparent"
                onClick={() => onCompletionFilterChange("all")}
              >
                <XIcon className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredEntries === totalEntries 
            ? `총 ${totalEntries}개의 일기`
            : `${filteredEntries}개 일기 (전체 ${totalEntries}개 중)`
          }
        </span>
        {hasActiveFilters && (
          <span className="text-primary">
            필터 적용됨
          </span>
        )}
      </div>
    </div>
  );
}