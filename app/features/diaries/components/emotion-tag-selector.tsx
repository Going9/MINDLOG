import { useState } from "react";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Badge } from "~/common/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/common/components/ui/select";
import { Separator } from "~/common/components/ui/separator";
import { PlusIcon, XIcon, SmileIcon, FrownIcon, MinusIcon } from "lucide-react";

interface EmotionTag {
  id: number;
  name: string;
  color: string;
  category: "positive" | "negative" | "neutral";
  isDefault: boolean;
}

interface EmotionTagSelectorProps {
  selectedTags: EmotionTag[];
  onTagsChange: (tags: EmotionTag[]) => void;
}

// 임시 기본 감정 태그 데이터
const DEFAULT_EMOTION_TAGS: EmotionTag[] = [
  {
    id: 1,
    name: "기쁨",
    color: "#10B981",
    category: "positive",
    isDefault: true,
  },
  {
    id: 2,
    name: "행복",
    color: "#3B82F6",
    category: "positive",
    isDefault: true,
  },
  {
    id: 3,
    name: "감사",
    color: "#8B5CF6",
    category: "positive",
    isDefault: true,
  },
  {
    id: 4,
    name: "설렘",
    color: "#F59E0B",
    category: "positive",
    isDefault: true,
  },
  {
    id: 5,
    name: "슬픔",
    color: "#6B7280",
    category: "negative",
    isDefault: true,
  },
  {
    id: 6,
    name: "분노",
    color: "#EF4444",
    category: "negative",
    isDefault: true,
  },
  {
    id: 7,
    name: "불안",
    color: "#F97316",
    category: "negative",
    isDefault: true,
  },
  {
    id: 8,
    name: "걱정",
    color: "#84CC16",
    category: "negative",
    isDefault: true,
  },
  {
    id: 9,
    name: "평온",
    color: "#06B6D4",
    category: "neutral",
    isDefault: true,
  },
  {
    id: 10,
    name: "무관심",
    color: "#64748B",
    category: "neutral",
    isDefault: true,
  },
];

export function EmotionTagSelector({
  selectedTags,
  onTagsChange,
}: EmotionTagSelectorProps) {
  const [customTags, setCustomTags] = useState<EmotionTag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagCategory, setNewTagCategory] = useState<
    "positive" | "negative" | "neutral"
  >("neutral");
  const [isAddingTag, setIsAddingTag] = useState(false);

  const allTags = [...DEFAULT_EMOTION_TAGS, ...customTags];

  const toggleTag = (tag: EmotionTag) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const createCustomTag = () => {
    if (!newTagName.trim()) return;

    const getCategoryColor = (
      category: "positive" | "negative" | "neutral"
    ) => {
      switch (category) {
        case "positive":
          return "#10B981"; // 초록색
        case "negative":
          return "#EF4444"; // 빨간색
        default:
          return "#6B7280"; // 회색
      }
    };

    const newTag: EmotionTag = {
      id: Date.now(), // 임시 ID
      name: newTagName.trim(),
      color: getCategoryColor(newTagCategory),
      category: newTagCategory,
      isDefault: false,
    };

    setCustomTags([...customTags, newTag]);
    onTagsChange([...selectedTags, newTag]);
    setNewTagName("");
    setNewTagCategory("neutral");
    setIsAddingTag(false);
  };

  const getTagVariant = (tag: EmotionTag) => {
    if (selectedTags.find(t => t.id === tag.id)) {
      return "default";
    }
    return "secondary";
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "positive":
        return "긍정적";
      case "negative":
        return "부정적";
      default:
        return "중립적";
    }
  };

  const groupedTags = {
    positive: allTags.filter(tag => tag.category === "positive"),
    negative: allTags.filter(tag => tag.category === "negative"),
    neutral: allTags.filter(tag => tag.category === "neutral"),
  };

  return (
    <div className='space-y-4'>
      {/* 선택된 태그들 */}
      {selectedTags.length > 0 && (
        <div className='space-y-3 p-4 bg-muted/80 rounded-lg'>
          <Label className='text-sm font-medium flex items-center gap-2'>
            선택된 감정
          </Label>
          <div className='flex flex-wrap gap-2'>
            {selectedTags.map(tag => (
              <Badge
                key={tag.id}
                variant='default'
                style={{ backgroundColor: tag.color }}
                className='text-white cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 h-8 text-sm'
                onClick={() => toggleTag(tag)}
              >
                {tag.name}
                <XIcon className='w-3 h-3 ml-1 hover:rotate-90 transition-transform' />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 감정 태그 카테고리별 표시 */}
      <div className='space-y-6'>
        {Object.entries(groupedTags).map(([category, tags], index) => (
          <div key={category}>
            {index > 0 && <Separator className='my-4' />}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <h4 className='text-sm font-semibold text-foreground'>
                  {getCategoryLabel(category)} 감정
                </h4>
              </div>
              <div className='flex flex-wrap gap-2'>
                {tags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={getTagVariant(tag)}
                    style={{
                      backgroundColor: selectedTags.find(t => t.id === tag.id)
                        ? tag.color
                        : "transparent",
                      borderColor: tag.color,
                      color: selectedTags.find(t => t.id === tag.id)
                        ? "white"
                        : tag.color,
                    }}
                    className='cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 border h-8 text-sm min-h-[32px] min-w-[44px] flex items-center justify-center'
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                    {!tag.isDefault && (
                      <span className='ml-1 text-xs opacity-70'>⭐</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 커스텀 태그 추가 */}
      <div className='space-y-3 pt-4 border-t'>
        <Label className='text-sm font-medium'>새로운 감정 태그 만들기</Label>
        {isAddingTag ? (
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <Input
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder='감정 이름 입력...'
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    createCustomTag();
                  } else if (e.key === "Escape") {
                    setIsAddingTag(false);
                    setNewTagName("");
                    setNewTagCategory("neutral");
                  }
                }}
                className='flex-1 placeholder:text-xs sm:placeholder:text-sm'
              />
              <Select
                value={newTagCategory}
                onValueChange={(value: "positive" | "negative" | "neutral") =>
                  setNewTagCategory(value)
                }
              >
                <SelectTrigger className='w-32'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='positive'>긍정적</SelectItem>
                  <SelectItem value='negative'>부정적</SelectItem>
                  <SelectItem value='neutral'>중립적</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex gap-2'>
              <Button
                size='sm'
                onClick={createCustomTag}
                disabled={!newTagName.trim()}
                className='flex-1'
              >
                추가
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setIsAddingTag(false);
                  setNewTagName("");
                  setNewTagCategory("neutral");
                }}
                className='flex-1'
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsAddingTag(true)}
            className='w-full'
          >
            <PlusIcon className='w-4 h-4 mr-2' />
            나만의 감정 태그 만들기
          </Button>
        )}
      </div>
    </div>
  );
}
