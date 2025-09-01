import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarFold,
  CheckIcon,
  HeartIcon,
  ImageIcon,
  MessageSquareIcon,
  PenToolIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { Progress } from "~/common/components/ui/progress";
import { Textarea } from "~/common/components/ui/textarea";
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

interface SteppedDiaryFormProps {
  initialData?: Partial<DiaryFormData>;
  onSubmit: (data: DiaryFormData) => void;
  onSave: (data: Partial<DiaryFormData>, step: number) => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

const steps = [
  {
    id: 1,
    title: "감정 태그",
    shortTitle: "감정",
    description: "오늘 느낀 감정을 선택해보세요",
    icon: HeartIcon,
  },
  {
    id: 2,
    title: "하루 요약",
    shortTitle: "요약",
    description: "오늘을 한 줄로 요약하고 이미지를 추가해보세요",
    icon: PenToolIcon,
  },
  {
    id: 3,
    title: "상황 & 감정",
    shortTitle: "상황",
    description: "상황과 그때의 감정을 자세히 적어보세요",
    icon: MessageSquareIcon,
  },
  {
    id: 4,
    title: "반응",
    shortTitle: "반응",
    description: "신체적 감각과 원하는 반응을 적어보세요",
    icon: ActivityIcon,
  },
  {
    id: 5,
    title: "감사 & 격려",
    shortTitle: "감사",
    description: "감사한 순간과 자신에게 하고 싶은 말을 적어보세요",
    icon: SparklesIcon,
  },
];

export function SteppedDiaryForm({
  initialData,
  onSubmit,
  onSave,
  isLoading = false,
  isEditing = false,
}: SteppedDiaryFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [savedSteps, setSavedSteps] = useState<Set<number>>(new Set());
  const [showCompleteConfirmation, setShowCompleteConfirmation] =
    useState(false);

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

  const handleSaveStep = () => {
    onSave(formData, currentStep);
    setSavedSteps(prev => new Set([...prev, currentStep]));
  };

  const handleFinalSubmit = () => {
    onSubmit(formData);
  };

  const handleEarlyCompletion = () => {
    setShowCompleteConfirmation(true);
  };

  const confirmCompletion = () => {
    onSubmit(formData);
    setShowCompleteConfirmation(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const getCurrentStepData = () => {
    const current = steps.find(step => step.id === currentStep);
    return current || steps[0];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-6'>
            <EmotionTagSelector
              selectedTags={formData.emotionTags || []}
              onTagsChange={tags => handleInputChange("emotionTags", tags)}
            />
          </div>
        );

      case 2:
        return (
          <div className='space-y-6'>
            {/* 한줄 요약 */}
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
          </div>
        );

      case 3:
        return (
          <div className='space-y-6'>
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
          </div>
        );

      case 4:
        return (
          <div className='space-y-6'>
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
          </div>
        );

      case 5:
        return (
          <div className='space-y-6'>
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
          </div>
        );

      default:
        return null;
    }
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

      {/* Enhanced Progress Indicator */}
      <div className='mb-8'>
        {/* Progress Bar */}
        <div className='mb-6'>
          <div className='flex justify-between text-sm text-muted-foreground mb-2'>
            <span>{currentStep}단계</span>
            <span>{steps.length}단계 중</span>
          </div>
          <Progress
            value={(currentStep / steps.length) * 100}
            className='h-2'
          />
        </div>

        {/* Step Indicators with Icons */}
        <div className='grid grid-cols-5 gap-2 mb-4'>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = savedSteps.has(step.id);
            const isCurrent = currentStep === step.id;
            const isPast = currentStep > step.id;

            return (
              <div key={step.id} className='text-center'>
                <div
                  className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : isCompleted
                        ? "bg-green-500 text-white shadow-md hover:scale-105"
                        : isPast
                          ? "bg-muted-foreground text-white hover:scale-105"
                          : "bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-white"
                  }`}
                  onClick={() => goToStep(step.id)}
                >
                  {isCompleted ? (
                    <CheckIcon className='w-5 h-5' />
                  ) : (
                    <StepIcon className='w-5 h-5' />
                  )}
                </div>
                <p
                  className={`text-xs font-medium hidden sm:block ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-green-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.shortTitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Date Display */}
        <div className='text-center'>
          <div className='mt-2 inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground'>
            <CalendarFold />
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
      </div>

      <Card>
        <CardHeader className='mb-8'>
          <CardTitle className='flex items-center gap-3 mb-2'>
            {(() => {
              const currentStepData = getCurrentStepData();
              const StepIcon = currentStepData.icon || HeartIcon;
              return (
                <>
                  <div className='p-2 bg-primary/10 rounded-lg'>
                    <StepIcon className='w-5 h-5 text-primary' />
                  </div>
                  <span>{currentStepData.title}</span>
                </>
              );
            })()}
          </CardTitle>
          <CardDescription className='text-base'>
            {getCurrentStepData().description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>{renderStepContent()}</div>

          {/* Simplified Action Buttons */}
          <div className='pt-6 border-t mt-6 space-y-4'>
            {/* First row - Navigation buttons */}
            <div className='flex gap-3 justify-between'>
              <Button
                type='button'
                variant='outline'
                onClick={prevStep}
                disabled={currentStep === 1}
                className='flex items-center gap-2 h-11 flex-1 sm:min-w-[120px] sm:flex-none'
              >
                <ArrowLeftIcon className='w-4 h-4' />
                이전
              </Button>

              {currentStep < steps.length && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={nextStep}
                  className='flex items-center gap-2 h-11 flex-1 sm:min-w-[120px] sm:flex-none'
                >
                  다음
                  <ArrowRightIcon className='w-4 h-4' />
                </Button>
              )}
            </div>

            {/* Second row - Action buttons */}
            <div className='flex gap-3 justify-between'>
              <Button
                type='button'
                variant='outline'
                asChild
                className='flex items-center justify-center h-11 flex-1 sm:min-w-[120px] sm:flex-none'
              >
                <Link to='/diary'>취소</Link>
              </Button>

              <Button
                type='button'
                onClick={
                  currentStep === steps.length
                    ? handleFinalSubmit
                    : handleEarlyCompletion
                }
                disabled={isLoading}
                className='flex items-center justify-center gap-2 h-11 flex-1 sm:min-w-[120px] sm:flex-none'
              >
                {isLoading ? "완료 중..." : "완료하기"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Early Completion Confirmation Dialog */}
      {showCompleteConfirmation && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-background rounded-lg p-6 max-w-md w-full border shadow-lg'>
            <h3 className='text-lg font-semibold mb-4'>일기 완료하기</h3>
            <p className='text-sm md:text-base text-muted-foreground mb-6'>
              아직 {steps.length - currentStep}개의 단계가 남아있습니다. 지금
              완료하시겠습니까? 작성한 내용은 모두 저장됩니다.
            </p>
            <div className='flex gap-3 justify-center'>
              <Button
                variant='outline'
                onClick={() => setShowCompleteConfirmation(false)}
                className='min-w-[100px]'
              >
                계속 작성
              </Button>
              <Button onClick={confirmCompletion} className='min-w-[100px]'>
                완료하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
