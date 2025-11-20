import { useState, useEffect } from 'react';
import { getGreetingByTime } from '@/utils/index';
export function useGreeting() {
  const [greeting, setGreeting] = useState(getGreetingByTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreetingByTime());
    }, 30 * 60 * 1000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  return greeting;
}
