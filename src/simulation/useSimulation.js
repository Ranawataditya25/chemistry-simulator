// useSimulation.js
// Simulation hook for zero-order reaction A → B.
// startWith(a0) accepts a dynamic initial concentration so the graph's c1 setting is used.

import { useState, useEffect, useRef, useCallback } from "react";
import { calculateZeroOrder } from "./engine";

const K   = 0.080; // rate constant (M/s)
const T2  = 10.0;  // reaction end time (s)

export default function useSimulation() {
  const [time,     setTime]     = useState(0);
  const [A,        setA]        = useState(0.8);
  const [B,        setB]        = useState(0);
  const [running,  setRunning]  = useState(false);
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef(null);
  const a0Ref       = useRef(0.8); // stores A0 for the current run

  // Clear any running interval on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    setTime(0);
    setA(a0Ref.current);
    setB(0);
  }, []);

  // startWith(a0): begin simulation using provided initial concentration
  const startWith = useCallback((a0 = 0.8, k = 0.08, tEnd = 10) => {
    clearInterval(intervalRef.current);
    a0Ref.current = a0;

    setFinished(false);
    setTime(0);
    setA(a0);
    setB(0);
    setRunning(true);

    intervalRef.current = setInterval(() => {
      setTime(prev => {
        const newTime = parseFloat((prev + 0.1).toFixed(2));
        const { A: newA, B: newB } = calculateZeroOrder({ A0: a0, k, time: newTime });
        setA(newA);
        setB(newB);

        if (newTime >= tEnd) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setFinished(true);
        }
        return newTime;
      });
    }, 80);
  }, []);

 return {
  time, A, B,
  running, finished,
  A0: a0Ref.current,
  startWith,
  reset,
};
}