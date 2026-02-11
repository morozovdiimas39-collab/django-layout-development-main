import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

declare global {
  interface Window {
    ym: any;
  }
}

export default function MetrikaGoalPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('⏳ Отправка цели...');
  
  const goal = searchParams.get('goal') || 'trial';
  const clientId = searchParams.get('client_id') || '';

  useEffect(() => {
    console.log('Sending Metrika goal:', goal, 'Client ID:', clientId);
    
    const timer = setTimeout(() => {
      if (typeof window.ym !== 'undefined') {
        window.ym(104854671, 'reachGoal', goal);
        console.log('✅ Goal sent:', goal);
        setStatus(`✅ Цель "${goal}" отправлена в Яндекс.Метрику`);
      } else {
        console.error('❌ Yandex.Metrika not loaded');
        setStatus('❌ Ошибка: счётчик не загружен');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [goal, clientId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}
