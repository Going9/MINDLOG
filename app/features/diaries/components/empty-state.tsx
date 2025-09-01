// src/app/features/diaries/components/empty-state.tsx

/**
 * ## 컴포넌트 흐름 및 역할
 *
 * 이 컴포넌트는 목록에 표시할 데이터가 없을 때 사용자에게 상황을 알려주는 역할을 합니다.
 * 예를 들어, 작성된 일기가 아예 없거나, 필터링 결과가 없는 경우에 이 컴포넌트가 표시됩니다.
 * 단순히 "없음"이라고 표시하는 대신, 상황에 맞는 안내 메시지와 아이콘, 그리고 다음에 할 행동을
 * 제안하는 버튼(예: "새 일기 쓰기", "필터 초기화")을 보여주어 사용자 경험을 향상시킵니다.
 *
 * ## 코드 구조 및 원리
 *
 * - 부모 컴포넌트로부터 `type`이라는 prop을 받아서 어떤 종류의 "빈 상태"를 표시할지 결정합니다.
 *   - `no-entries`: 작성된 일기가 하나도 없을 때
 *   - `date-no-entries`: 특정 날짜를 선택했지만 해당 날짜에 일기가 없을 때
 *   - `no-results`: 필터를 적용했지만 결과가 없을 때
 * - 각 `type`에 따라 다른 아이콘, 다른 텍스트, 다른 버튼을 보여주는 조건부 렌더링(if 문)을 사용합니다.
 * - `Link` 컴포넌트를 사용하여 사용자가 "새 일기 쓰기" 페이지로 쉽게 이동할 수 있도록 돕습니다.
 * - `onClearFilters` 함수를 prop으로 받아서, 필터 결과가 없을 때 사용자가 필터를 쉽게 초기화할 수 있는
 *   버튼을 제공합니다. 이는 부모-자식 컴포넌트 간의 상호작용의 좋은 예입니다.
 */

import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { BookOpenIcon, PlusIcon, CalendarIcon, SearchIcon } from "lucide-react";

// 이 컴포넌트가 받을 props(속성)의 타입을 정의합니다.
interface EmptyStateProps {
  // 어떤 종류의 빈 상태를 표시할지 결정하는 타입
  type: "no-entries" | "no-results" | "date-no-entries";
  // 'date-no-entries' 타입일 때 표시할 날짜
  selectedDate?: Date;
  // 'no-results' 타입일 때 필터를 초기화하는 함수
  onClearFilters?: () => void;
}

export function EmptyState({ type, selectedDate, onClearFilters }: EmptyStateProps) {
  // 타입이 "no-entries"일 때의 UI
  if (type === "no-entries") {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <BookOpenIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">아직 작성된 일기가 없습니다</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            첫 번째 일기를 작성해서 감정과 생각을 기록해보세요
          </p>
        </div>
        <Button asChild size="lg" className="mt-6">
          <Link to="/diary/new">
            <PlusIcon className="w-4 h-4 mr-2" />
            첫 일기 쓰기
          </Link>
        </Button>
      </div>
    );
  }

  // 타입이 "date-no-entries"이고 날짜가 선택되었을 때의 UI
  if (type === "date-no-entries" && selectedDate) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="p-3 bg-muted/20 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
          <CalendarIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">
            {selectedDate.toLocaleDateString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </h4>
          <p className="text-sm text-muted-foreground">
            이 날에 작성된 일기가 없습니다
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/diary/new">
            <PlusIcon className="w-4 h-4 mr-2" />
            이 날짜에 일기 쓰기
          </Link>
        </Button>
      </div>
    );
  }

  // 타입이 "no-results"일 때의 UI
  if (type === "no-results") {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="p-3 bg-muted/20 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
          <SearchIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">검색 결과가 없습니다</h4>
          <p className="text-sm text-muted-foreground">
            다른 검색어나 필터를 시도해보세요
          </p>
        </div>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            필터 초기화
          </Button>
        )}
      </div>
    );
  }

  return null;
}
