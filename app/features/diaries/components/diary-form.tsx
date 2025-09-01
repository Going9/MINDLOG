import { useState } from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import {
  CalendarIcon,
  SaveIcon,
  ImageIcon,
  XIcon,
  BookHeart,
} from "lucide-react";
import { EmotionTagSelector } from "./emotion-tag-selector";

interface EmotionTag {
  id: number;
  name: string;
  color: string;
  category: "positive" | "negative" | "neutral";
  isDefault: boolean;
}

interface DiaryFormData {
  date: Date;
  shortContent?: string;
  situation?: string;
  reaction?: string;
  physicalSensation?: string;
  desiredReaction?: string;
  gratitudeMoment?: string;
  selfKindWords?: string;
  imageFile?: File;
  emotionTags?: EmotionTag[];
}

interface DiaryFormProps {
  initialData?: Partial<DiaryFormData>;
  onSubmit: (data: DiaryFormData) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export function DiaryForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEditing = false,
}: DiaryFormProps) {
  const [formData, setFormData] = useState<DiaryFormData>({
    date: initialData?.date || new Date(),
    shortContent: initialData?.shortContent || "",
    situation: initialData?.situation || "",
    reaction: initialData?.reaction || "",
    physicalSensation: initialData?.physicalSensation || "",
    desiredReaction: initialData?.desiredReaction || "",
    gratitudeMoment: initialData?.gratitudeMoment || "",
    selfKindWords: initialData?.selfKindWords || "",
    imageFile: undefined,
    emotionTags: initialData?.emotionTags || [],
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof DiaryFormData,
    value: string | Date | File | EmotionTag[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: undefined }));
    setSelectedImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <Breadcrumb className='mb-6'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to='/'>홈</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to='/diary'>일기</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isEditing ? "일기 수정" : "일기 쓰기"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className='mb-3'>
          <CardTitle className='flex items-center gap-2 mb-1'>
            {isEditing ? "일기 수정" : "감정 일기 쓰기"}
          </CardTitle>
          <CardDescription>
            오늘 하루의 감정과 경험을 기록해보세요. 각 항목은 선택사항이며,
            편안하게 작성하시면 됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* 오늘 날짜 표시 */}
            <div className='space-y-2'>
              <Label>작성일</Label>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span>
                  {new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </span>
              </div>
            </div>

            {/* 짧은 내용 */}
            <div className='space-y-2'>
              <Label htmlFor='shortContent'>
                오늘 하루를 한 줄로 요약하면?
              </Label>
              <Input
                id='shortContent'
                placeholder='예: 새로운 프로젝트를 시작한 흥미진진한 하루'
                value={formData.shortContent}
                onChange={e =>
                  handleInputChange("shortContent", e.target.value)
                }
                maxLength={100}
                className='placeholder:text-xs sm:placeholder:text-sm'
              />
              <p className='text-xs text-muted-foreground'>
                {formData.shortContent?.length || 0}/100
              </p>
            </div>

            {/* 이미지 첨부 */}
            <div className='space-y-3'>
              <Label>이미지 첨부 (선택사항)</Label>
              <div className='space-y-3'>
                <div className='flex items-center gap-4'>
                  <input
                    type='file'
                    id='imageFile'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      document.getElementById("imageFile")?.click()
                    }
                    className='flex items-center gap-2'
                  >
                    <ImageIcon className='w-4 h-4' />
                    이미지 선택
                  </Button>
                  {selectedImage && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={removeImage}
                      className='text-red-600 hover:text-red-700'
                    >
                      <XIcon className='w-4 h-4 mr-1' />
                      제거
                    </Button>
                  )}
                </div>
                {selectedImage && (
                  <div className='relative w-fit'>
                    <img
                      src={selectedImage}
                      alt='첨부된 이미지'
                      className='max-w-xs max-h-48 rounded-lg border'
                    />
                  </div>
                )}
                <p className='text-xs text-muted-foreground'>
                  일기와 함께 저장할 이미지를 선택해주세요
                </p>
              </div>
            </div>

            {/* 감정 태그 선택 */}
            <EmotionTagSelector
              selectedTags={formData.emotionTags || []}
              onTagsChange={tags => handleInputChange("emotionTags", tags)}
            />

            {/* 상황 */}
            <div className='space-y-2'>
              <Label htmlFor='situation'>어떤 상황이었나요?</Label>
              <Textarea
                id='situation'
                placeholder='무슨 일이 일어났는지 자세히 적어보세요...'
                value={formData.situation}
                onChange={e => handleInputChange("situation", e.target.value)}
                className='min-h-[120px] placeholder:text-xs sm:placeholder:text-sm'
                maxLength={1000}
              />
              <p className='text-xs text-muted-foreground'>
                {formData.situation?.length || 0}/1000
              </p>
            </div>

            {/* 반응 */}
            <div className='space-y-2'>
              <Label htmlFor='reaction'>그때 어떤 감정을 느꼈나요?</Label>
              <Textarea
                id='reaction'
                placeholder='그 상황에서 느낀 감정과 생각을 적어보세요...'
                value={formData.reaction}
                onChange={e => handleInputChange("reaction", e.target.value)}
                className='min-h-[120px] placeholder:text-xs sm:placeholder:text-sm'
                maxLength={1000}
              />
              <p className='text-xs text-muted-foreground'>
                {formData.reaction?.length || 0}/1000
              </p>
            </div>

            {/* 신체 감각 */}
            <div className='space-y-2'>
              <Label htmlFor='physicalSensation'>
                몸에서는 어떤 느낌이 들었나요?
              </Label>
              <Textarea
                id='physicalSensation'
                placeholder='예: 심장이 빨리 뛰었다, 어깨가 무거웠다, 숨이 깊어졌다...'
                value={formData.physicalSensation}
                onChange={e =>
                  handleInputChange("physicalSensation", e.target.value)
                }
                className='min-h-[100px] placeholder:text-xs sm:placeholder:text-sm'
                maxLength={500}
              />
              <p className='text-xs text-muted-foreground'>
                {formData.physicalSensation?.length || 0}/500
              </p>
            </div>

            {/* 원하는 반응 */}
            <div className='space-y-2'>
              <Label htmlFor='desiredReaction'>
                다음에는 어떻게 반응하고 싶나요?
              </Label>
              <Textarea
                id='desiredReaction'
                placeholder='비슷한 상황이 생긴다면 어떻게 대처하고 싶은지 적어보세요...'
                value={formData.desiredReaction}
                onChange={e =>
                  handleInputChange("desiredReaction", e.target.value)
                }
                className='min-h-[100px] placeholder:text-xs sm:placeholder:text-sm'
                maxLength={500}
              />
              <p className='text-xs text-muted-foreground'>
                {formData.desiredReaction?.length || 0}/500
              </p>
            </div>

            {/* 감사한 순간 */}
            <div className='space-y-2'>
              <Label htmlFor='gratitudeMoment'>
                오늘 감사했던 순간이 있다면?
              </Label>
              <Textarea
                id='gratitudeMoment'
                placeholder='작은 것이라도 좋으니 감사했던 순간을 적어보세요...'
                value={formData.gratitudeMoment}
                onChange={e =>
                  handleInputChange("gratitudeMoment", e.target.value)
                }
                className='min-h-[100px] placeholder:text-xs sm:placeholder:text-sm'
                maxLength={500}
              />
              <p className='text-xs text-muted-foreground'>
                {formData.gratitudeMoment?.length || 0}/500
              </p>
            </div>

            {/* 자신에게 하고 싶은 말 */}
            <div className='space-y-2'>
              <Label htmlFor='selfKindWords'>자신에게 따뜻한 말 한마디</Label>
              <Textarea
                id='selfKindWords'
                placeholder='오늘 하루 수고한 자신에게 격려와 위로의 말을 해보세요...'
                value={formData.selfKindWords}
                onChange={e =>
                  handleInputChange("selfKindWords", e.target.value)
                }
                className='min-h-[100px] placeholder:text-xs sm:placeholder:text-sm'
                maxLength={500}
              />
              <p className='text-xs text-muted-foreground'>
                {formData.selfKindWords?.length || 0}/500
              </p>
            </div>

            {/* 버튼들 */}
            <div className='flex items-center justify-end gap-3 pt-6 border-t'>
              <Button type='button' variant='outline' asChild>
                <Link to='/diary'>취소</Link>
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? "저장 중..." : isEditing ? "수정하기" : "저장하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
