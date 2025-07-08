/* FlashSaleCountdown */

/*components/FlashSaleCountdown.tsx*/
"use client";

import { useEffect, useState } from "react";

/**
 * A helper function that calculates the time difference between a future date and now.
 * It is defined outside the component because it doesn't depend on any component state.
 * @param {Date} endDate - The future date when the countdown ends.
 * @returns An object with the remaining days, hours, minutes, and seconds.
 */
const calculateTimeLeft = (endDate: Date) => {
  // Get the difference in milliseconds
  const difference = +new Date(endDate) - +new Date();

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  // Only calculate if the difference is positive (i.e., the date is in the future)
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

/**
 * A Client Component that displays a countdown timer for a flash sale.
 * It receives the end date as a prop from a Server Component.
 * @param {Date} saleEndsAt - The date and time when the sale ends.
 */
export default function FlashSaleCountdown({ saleEndsAt }: { saleEndsAt: Date }) {
  // Initialize state with the initial calculation to prevent a flash of 00:00:00
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(saleEndsAt));

  // The useEffect hook sets up the interval timer.
  useEffect(() => {
    // Set up a timer that calls the update function every 1000ms (1 second).
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(saleEndsAt));
    }, 1000);

    // This is a crucial cleanup function.
    // It runs when the component is unmounted (e.g., user navigates away)
    // to prevent memory leaks from the running interval.
    return () => clearInterval(timer);
  }, [saleEndsAt]); // The effect re-runs only if the `saleEndsAt` prop changes.

  // A helper function to add a leading zero to numbers less than 10.
  const padZero = (num: number) => num.toString().padStart(2, '0');

  // Check if the time has run out to display a final message.
  const isTimeUp = Object.values(timeLeft).every(val => val === 0);

  return (
    <div className="flex justify-center gap-3 rounded-lg bg-red-600 p-4 text-center text-white shadow-lg md:gap-6">
      {isTimeUp ? (
        <span className="text-2xl font-bold tracking-wider">DEAL HAS ENDED!</span>
      ) : (
        <>
          <div className="flex flex-col">
            <span className="text-2xl font-bold md:text-4xl">{padZero(timeLeft.days)}</span>
            <span className="text-xs font-semibold uppercase">Days</span>
          </div>
          <span className="text-2xl font-bold md:text-4xl">:</span>
          <div className="flex flex-col">
            <span className="text-2xl font-bold md:text-4xl">{padZero(timeLeft.hours)}</span>
            <span className="text-xs font-semibold uppercase">Hours</span>
          </div>
          <span className="text-2xl font-bold md:text-4xl">:</span>
          <div className="flex flex-col">
            <span className="text-2xl font-bold md:text-4xl">{padZero(timeLeft.minutes)}</span>
            <span className="text-xs font-semibold uppercase">Mins</span>
          </div>
          <span className="text-2xl font-bold md:text-4xl">:</span>
          <div className="flex flex-col">
            <span className="text-2xl font-bold md:text-4xl">{padZero(timeLeft.seconds)}</span>
            <span className="text-xs font-semibold uppercase">Secs</span>
          </div>
        </>
      )}
    </div>
  );
}