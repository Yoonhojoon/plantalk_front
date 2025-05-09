import { useAuth } from "@/contexts/AuthContext";
import { usePlantContext } from "@/contexts/PlantContext";
import PlantCharacter from "@/components/PlantCharacter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardScreen() {
  const { user } = useAuth();
  const { plants, representativePlantId } = usePlantContext();
  const [plantStatus, setPlantStatus] = useState<any>(null);

  // 대표 식물 정보 가져오기
  const representativePlant = plants.find(p => p.id === representativePlantId);

  // 식물 상태 정보 가져오기
  useEffect(() => {
    const fetchPlantStatus = async () => {
      if (representativePlantId) {
        try {
          const { data, error } = await supabase
            .from('plant_status_logs')
            .select('*')
            .eq('plant_id', representativePlantId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error) throw error;
          setPlantStatus(data);
        } catch (error) {
          console.error('식물 상태 정보를 가져오는데 실패했습니다:', error);
        }
      }
    };

    fetchPlantStatus();
  }, [representativePlantId]);

  // 감정 상태 계산 함수 (간단 버전)
  const getEmotionalState = (plant) => {
    if (!plant || !plantStatus) return "행복해요";
    const { temperature, humidity, light } = plantStatus;
    const env = {
      temperature: {
        min: plant.temp_range_min,
        max: plant.temp_range_max
      },
      humidity: {
        min: plant.humidity_range_min,
        max: plant.humidity_range_max
      },
      light: {
        min: plant.light_range_min,
        max: plant.light_range_max
      }
    };

    if (temperature < env.temperature.min) return "추워요";
    if (temperature > env.temperature.max) return "더워요";
    if (humidity < env.humidity.min) return "건조해요";
    if (humidity > env.humidity.max) return "습해요";
    if (light < env.light.min) return "너무 어두워요";
    if (light > env.light.max) return "햇빛이 너무 강해요";
    return "행복해요";
  };

  // 임시 출석 현황 (이번 주 월~일, 최근 7일간 물 준 날짜 체크)
  const getAttendance = (plant) => {
    if (!plant || !plant.lastWatered) return [false, false, false, false, true, true, false];
    const today = new Date();
    const week = [false, false, false, false, true, true, false]; // 금, 토만 체크
    const wateredDate = new Date(plant.lastWatered);
    // 이번 주에 물을 준 경우만 체크 (간단 구현)
    if (wateredDate) {
      const diff = (today.getDay() + 6) % 7 - wateredDate.getDay(); // 월요일 시작
      if (diff <= 0 && Math.abs(diff) < 7) {
        week[wateredDate.getDay() === 0 ? 6 : wateredDate.getDay() - 1] = true;
      }
    }
    return week;
  };

  const attendance = getAttendance(representativePlant);
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20 flex flex-col min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">안녕하세요, {user?.fullName?.split(' ')[0] || '사용자'}님</h1>
        <p className="text-sm text-muted-foreground">Plantalk에 오신 것을 환영합니다</p>
      </div>

      <div className="bg-plant-light-green/25 rounded-2xl mb-8 px-5 py-4 flex flex-col">
        <h2 className="text-lg font-bold text-plant-green mb-1">식물 관리 팁</h2>
        <p className="text-sm text-gray-700 mt-1 mb-0">여름철에는 습도 수준을 확인하세요. 식물에 더 많은 물이 필요할 수 있습니다!</p>
      </div>

      <div className="flex-1" />

      {/* 대표 식물 영역 - 하단 고정 느낌 */}
      <div className="mb-4">
        {representativePlant ? (
          <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6 mb-4">
            {/* 감정 캐릭터와 레벨 */}
            <div className="mb-2">
              <PlantCharacter 
                emotionalState={getEmotionalState(representativePlant)} 
                imageUrl={representativePlant.image_url}
              />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold">{representativePlant.name}</span>
            </div>
            <div className="text-sm text-muted-foreground mb-2">{getEmotionalState(representativePlant)}</div>
            {/* 출석 현황 */}
            <div className="w-full mt-2">
              <div className="text-xs text-gray-500 mb-1">이번 주 출석 현황</div>
              <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                {days.map((d, i) => (
                  <div key={d} className="flex flex-col items-center">
                    <span className="text-xs mb-1">{d}</span>
                    {attendance[i] ? (
                      <span className="w-5 h-5 rounded-full bg-plant-green flex items-center justify-center text-white text-xs">✓</span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">-</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 mb-4">
            <span className="text-lg text-gray-400 mb-2">대표 식물이 없습니다</span>
            <span className="text-sm text-gray-400">식물들 탭에서 대표 식물을 지정해 주세요</span>
          </div>
        )}
      </div>
    </div>
  );
}
