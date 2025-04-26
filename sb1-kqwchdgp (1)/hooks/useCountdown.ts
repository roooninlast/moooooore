import { useState, useEffect } from 'react';
import { format, parse, differenceInSeconds } from 'date-fns';

export const useCountdown = (targetTime: string | undefined) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const target = parse(targetTime, 'h:mm a', new Date());
      const targetDateTime = parse(`${today} ${format(target, 'HH:mm')}`, 'yyyy-MM-dd HH:mm', new Date());

      // If target time is in the past, add 24 hours
      if (targetDateTime < now) {
        targetDateTime.setDate(targetDateTime.getDate() + 1);
      }

      const diffInSeconds = differenceInSeconds(targetDateTime, now);
      
      return {
        hours: Math.floor(diffInSeconds / 3600),
        minutes: Math.floor((diffInSeconds % 3600) / 60),
        seconds: diffInSeconds % 60,
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return timeLeft;
};