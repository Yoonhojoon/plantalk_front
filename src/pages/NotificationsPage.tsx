import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'watering' | 'temperature' | 'humidity' | 'light';
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 더미 데이터 로드
    const dummyNotifications: Notification[] = [
      {
        id: '1',
        title: '물주기 알림',
        message: '피스 릴리에게 물을 줄 시간이에요!',
        type: 'watering',
        createdAt: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: '온도 경고',
        message: '몬스테라가 너무 덥다고 해요. 온도를 낮춰주세요.',
        type: 'temperature',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
        read: false
      },
      {
        id: '3',
        title: '습도 알림',
        message: '산세베리아가 건조해요. 습도를 높여주세요.',
        type: 'humidity',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
        read: true
      },
      {
        id: '4',
        title: '물주기 완료',
        message: '피스 릴리에게 물을 주셨네요!',
        type: 'watering',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
        read: true
      },
      {
        id: '5',
        title: '광량 경고',
        message: '몬스테라가 햇빛이 너무 강하다고 해요.',
        type: 'light',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2일 전
        read: true
      }
    ];

    setNotifications(dummyNotifications);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'watering':
        return '💧';
      case 'temperature':
        return '🌡️';
      case 'humidity':
        return '💨';
      case 'light':
        return '☀️';
      default:
        return '📢';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">알림</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          새로운 알림이 없습니다
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-white' : 'bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 