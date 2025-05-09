import { useEffect } from "react";
import { supabase } from "../lib/supabase";

interface PlantEmotionUpdaterProps {
  plantId: string;
  onUpdate?: () => void;
}

const PlantEmotionUpdater: React.FC<PlantEmotionUpdaterProps> = ({ plantId, onUpdate }) => {
  useEffect(() => {
    const updatePlantImageUrl = async () => {
      try {
        // 1. plants에서 species_id와 sensor_id 조회
        const { data: plant, error: plantError } = await supabase
          .from("plants")
          .select("species_id, sensor_id")
          .eq("id", plantId)
          .single();

        if (plantError || !plant) {
          console.error("식물 정보를 찾을 수 없습니다:", plantError);
          return;
        }

        if (!plant.sensor_id) {
          console.error("센서가 연결되어 있지 않습니다");
          return;
        }

        // 2. plant_species에서 name 조회
        const { data: species, error: speciesError } = await supabase
          .from("plant_species")
          .select("name")
          .eq("id", plant.species_id)
          .single();

            console.log(species.name);
        if (speciesError || !species) {
          console.error("품종 정보를 찾을 수 없습니다:", speciesError);
          return;
        }

        console.log(species.name);
        // 3. plant_status_logs에서 sensor_id로 최신 emotion 조회
        const { data: logs, error: logsError } = await supabase
          .from("plant_status_logs")
          .select("emotion")
          .eq("sensor_id", plant.sensor_id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (logsError) {
          console.error("상태 로그 조회 중 오류 발생:", logsError);
          return;
        }

        if (!logs || logs.length === 0) {
          console.log("상태 로그가 없습니다. 기본 이미지를 사용합니다.");

          // 기본 이미지 URL 설정
          const defaultImageUrl = `/images/emotion/${species.name}/happy.png`;
          
          const { error: updateError } = await supabase
            .from("plants")
            .update({ image_url: defaultImageUrl })
            .eq("id", plantId);

          if (updateError) {
            console.error("기본 이미지 URL 업데이트 실패:", updateError);
            return;
          }

          onUpdate?.();
          return;
        }

        const emotion = logs[0].emotion;
        if (!emotion) {
          console.error("감정 정보가 없습니다");
          return;
        }

        // 4. emotion의 첫 번째 값만 추출
        const firstEmotion = emotion.split(",")[0].trim();

        // 5. 이미지 URL 생성
        const imageUrl = `/images/emotion/${species.name}/${firstEmotion}.png`;
        console.log(imageUrl);
        // 6. plants 테이블의 image_url 업데이트
        const { error: updateError } = await supabase
          .from("plants")
          .update({ image_url: imageUrl })
          .eq("id", plantId);

        if (updateError) {
          console.error("이미지 URL 업데이트 실패:", updateError);
          return;
        }

        // 7. 업데이트 완료 후 콜백 실행
        onUpdate?.();
      } catch (error) {
        console.error("이미지 URL 업데이트 중 오류 발생:", error);
      }
    };

    updatePlantImageUrl();
  }, [plantId, onUpdate]);

  return null;
};

export default PlantEmotionUpdater; 