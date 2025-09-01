import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Badge } from "~/common/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import {
  CalendarIcon,
  CheckIcon,
  MoreHorizontalIcon,
  EditIcon,
  EyeIcon,
  TrashIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface EmotionTag {
  id: number;
  name: string;
  color: string;
  category: "positive" | "negative" | "neutral";
  isDefault: boolean;
}

interface DiaryEntry {
  id: string;
  date: Date;
  shortContent?: string;
  situation?: string;
  reaction?: string;
  physicalSensation?: string;
  desiredReaction?: string;
  gratitudeMoment?: string;
  selfKindWords?: string;
  emotionTags: EmotionTag[];
  completedSteps: number;
  totalSteps: number;
}

interface DiaryCardProps {
  entry: DiaryEntry;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function DiaryCard({ entry, onEdit, onDelete, onView }: DiaryCardProps) {
  const { date, shortContent, situation, emotionTags, completedSteps, totalSteps } = entry;
  
  const isComplete = completedSteps === totalSteps;
  const completionPercentage = (completedSteps / totalSteps) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {date.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                {date.toLocaleDateString("ko-KR", { weekday: "long" })}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(entry.id)}>
                <EyeIcon className="w-4 h-4 mr-2" />
                보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(entry.id)}>
                <EditIcon className="w-4 h-4 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(entry.id)}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Emotion Tags */}
        {emotionTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {emotionTags.slice(0, 4).map(tag => (
              <Badge
                key={tag.id}
                style={{ backgroundColor: tag.color }}
                className="text-white text-xs h-6 px-2"
              >
                {tag.name}
              </Badge>
            ))}
            {emotionTags.length > 4 && (
              <Badge variant="secondary" className="text-xs h-6 px-2">
                +{emotionTags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Content Preview */}
        <div className="space-y-2">
          {shortContent && (
            <p className="font-medium text-sm leading-relaxed line-clamp-2">
              {shortContent}
            </p>
          )}
          {situation && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {situation}
            </p>
          )}
        </div>

        {/* Completion Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center",
              isComplete ? "bg-green-500" : "bg-muted"
            )}>
              {isComplete && <CheckIcon className="w-3 h-3 text-white" />}
            </div>
            <span className="text-xs text-muted-foreground">
              {isComplete ? "완료" : `${completedSteps}/${totalSteps} 단계`}
            </span>
          </div>
          <div className="flex-1">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {Math.round(completionPercentage)}%
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onView(entry.id)}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            보기
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(entry.id)}
          >
            <EditIcon className="w-4 h-4 mr-2" />
            {isComplete ? "수정" : "계속 쓰기"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}