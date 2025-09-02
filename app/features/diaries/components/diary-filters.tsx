// src/app/features/diaries/components/diary-filters.tsx

/**
 * ## 컴포넌트 흐름 및 역할
 *
 * 이 컴포넌트는 일기 목록을 필터링하고 정렬하는 UI를 제공합니다.
 * 사용자가 검색어를 입력하거나, 정렬 순서를 바꾸거나, 특정 감정/상태를 선택하면
 * 그 값을 상위 컴포넌트(`DiaryListPage`)로 전달하여 실제 데이터 필터링이 일어나게 합니다.
 *
 * ## 코드 구조 및 원리
 *
 * - **제어 컴포넌트 (Controlled Component) 패턴**:
 *   이 컴포넌트는 자체적으로 상태를 가지지 않습니다. 모든 필터 값(예: `searchQuery`)
 *   과 그 값을 변경하는 함수(예: `onSearchChange`)를 부모로부터 props로 전달받습니다.
 *   사용자가 필터를 변경하면, 이 컴포넌트는 부모에게 받은 함수를 호출하여 "필터가 변경되었어요!"라고
 *   알려주기만 합니다. 그러면 부모 컴포넌트의 상태가 변경되고, 변경된 값이 다시 이 컴포넌트의
 *   props로 전달되어 화면이 업데이트됩니다.
 *   이 패턴은 상태 관리를 한 곳(부모 컴포넌트)에서 중앙 집중적으로 할 수 있게 하여 데이터 흐름을
 *   명확하고 예측 가능하게 만듭니다.
 *
 * - `DiaryFiltersProps` 인터페이스는 이 컴포넌트가 필요로 하는 모든 props를 명시합니다.
 * - `hasActiveFilters` 변수는 현재 필터가 하나라도 활성화되어 있는지 여부를 계산하여, "필터 초기화" 버튼이나
 *   활성 필터 목록을 보여줄지 말지를 결정합니다.
 * - `shadcn/ui`의 `Input`, `Select` 컴포넌트를 사용하여 필터 UI를 구성합니다.
 * - 하단에는 현재 활성화된 필터들을 `Badge` 컴포넌트로 시각적으로 보여주어 사용자가 어떤 필터를
 *   적용했는지 쉽게 알 수 있게 하고, 개별적으로 필터를 제거할 수도 있습니다.
 */

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
  SearchIcon,
  XIcon,
  SortAscIcon,
  SortDescIcon,
} from "lucide-react";

// --- 타입 정의 ---
interface EmotionTag {
  id: number;
  name: string;
  color: string | null;
  category: "positive" | "negative" | "neutral" | null;
  isDefault: boolean | null;
  usageCount?: number | null;
}

// 부모로부터 받아야 할 props(속성) 정의
interface DiaryFiltersProps {
  searchQuery: string; // 현재 검색어
  onSearchChange: (query: string) => void; // 검색어가 변경될 때 호출될 함수
  sortBy: string; // 현재 정렬 기준
  onSortChange: (sort: string) => void; // 정렬 기준이 변경될 때 호출될 함수
  selectedEmotionFilter?: EmotionTag; // 선택된 감정 필터
  onEmotionFilterChange: (emotion?: EmotionTag) => void; // 감정 필터가 변경될 때 호출될 함수
  completionFilter: string; // 현재 작성 상태 필터
  onCompletionFilterChange: (completion: string) => void; // 작성 상태 필터가 변경될 때 호출될 함수
  availableEmotions: EmotionTag[]; // 필터링에 사용할 수 있는 전체 감정 목록
  onClearFilters: () => void; // 모든 필터를 초기화할 때 호출될 함수
  totalEntries: number; // 전체 일기 개수
  filteredEntries: number; // 필터링된 일기 개수
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
  // 하나 이상의 필터가 활성화되어 있는지 여부를 나타내는 boolean 값
  const hasActiveFilters =
    searchQuery ||
    selectedEmotionFilter ||
    completionFilter !== "all" ||
    sortBy !== "date-desc";

  // 정렬 값(예: 'date-desc')에 해당하는 한글 레이블을 반환하는 함수
  const getSortLabel = (value: string) => {
    switch (value) {
      case "date-desc": return "최신순";
      case "date-asc": return "오래된순";
      case "completion-desc": return "완성도 높은 순";
      case "completion-asc": return "완성도 낮은 순";
      default: return "정렬 순서";
    }
  };

  // 작성 상태 값(예: 'complete')에 해당하는 한글 레이블을 반환하는 함수
  const getCompletionLabel = (value: string) => {
    switch (value) {
      case "all": return "전체";
      case "complete": return "완료된 일기";
      case "incomplete": return "미완료 일기";
      default: return "완성도";
    }
  };

  return (
    <div className="space-y-4">
      {/* 검색 및 정렬 영역 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 검색창 */}
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="일기 내용 검색..."
            value={searchQuery} // 부모로부터 받은 검색어 상태를 표시
            onChange={(e) => onSearchChange(e.target.value)} // 입력값이 변경되면 부모의 함수 호출
            className="pl-10"
          />
        </div>

        {/* 정렬 Select Box */}
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

      {/* 감정 및 상태 필터 영역 */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* 감정 필터 Select Box */}
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

        {/* 작성 상태 필터 Select Box */}
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

        {/* 필터 초기화 버튼 (필터가 활성화된 경우에만 보임) */}
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

      {/* 활성화된 필터 표시 영역 */}
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

      {/* 결과 요약 정보 */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filteredEntries === totalEntries
            ? `총 ${totalEntries}개의 일기`
            : `${filteredEntries}개 일기 (전체 ${totalEntries}개 중)`}
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
