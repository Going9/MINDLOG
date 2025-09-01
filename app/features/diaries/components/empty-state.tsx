import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { BookOpenIcon, PlusIcon, CalendarIcon, SearchIcon } from "lucide-react";

interface EmptyStateProps {
  type: "no-entries" | "no-results" | "date-no-entries";
  selectedDate?: Date;
  onClearFilters?: () => void;
}

export function EmptyState({ type, selectedDate, onClearFilters }: EmptyStateProps) {
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