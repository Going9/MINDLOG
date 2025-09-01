import { useState } from "react";
import { useNavigate } from "react-router";
import { SteppedDiaryForm } from "../components/stepped-diary-form";

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

export default function NewDiaryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: DiaryFormData) => {
    setIsLoading(true);
    
    try {
      // TODO: API 호출로 일기 저장 (전체 완료)
      console.log("Final saving diary:", data);
      
      // 임시로 1초 대기 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 시 일기 목록 페이지로 이동
      navigate("/diary");
    } catch (error) {
      console.error("Error saving diary:", error);
      // TODO: 에러 처리 (토스트 메시지 등)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStep = async (data: Partial<DiaryFormData>, step: number) => {
    try {
      // TODO: API 호출로 단계별 저장
      console.log(`Saving step ${step}:`, data);
      
      // 임시로 500ms 대기 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error("Error saving step:", error);
      // TODO: 에러 처리 (토스트 메시지 등)
    }
  };

  return (
    <SteppedDiaryForm 
      onSubmit={handleSubmit}
      onSave={handleSaveStep}
      isLoading={isLoading}
      isEditing={false}
    />
  );
}