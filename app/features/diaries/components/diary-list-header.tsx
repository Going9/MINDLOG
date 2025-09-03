import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { PlusIcon } from "lucide-react";

type DiaryListHeaderProps = {
  totalDiaries: number;
};

export function DiaryListHeader({ totalDiaries }: DiaryListHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">일기 목록</h1>
        <p className="text-muted-foreground mt-2">
          {totalDiaries}개의 일기가 있습니다
        </p>
      </div>
      {/* Desktop New Diary Button */}
      <Button asChild size="lg" className="hidden sm:flex">
        <Link to="/diary/new">
          <PlusIcon className="w-4 h-4 mr-2" />
          새 일기 쓰기
        </Link>
      </Button>
    </div>
  );
}