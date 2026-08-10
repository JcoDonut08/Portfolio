"use client";

import { useEffect, useState } from "react";

type NetworkInformation = EventTarget & {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithPerformanceHints = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

type AdaptivePerformance = {
  lowPowerMode: boolean;
  prefersReducedMotion: boolean;
};

const initialPerformance: AdaptivePerformance = {
  lowPowerMode: false,
  prefersReducedMotion: false,
};

function readPerformancePreference(
  reducedMotionQuery: MediaQueryList,
  constrainedDeviceQuery: MediaQueryList,
): AdaptivePerformance {
  const deviceNavigator = navigator as NavigatorWithPerformanceHints;
  const connection = deviceNavigator.connection;
  const hardwareConcurrency = deviceNavigator.hardwareConcurrency;
  const deviceMemory = deviceNavigator.deviceMemory;
  const constrainedNetwork =
    connection?.saveData === true ||
    ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
  const constrainedHardware =
    (hardwareConcurrency > 0 && hardwareConcurrency <= 4) ||
    (typeof deviceMemory === "number" && deviceMemory <= 4);

  return {
    lowPowerMode:
      constrainedDeviceQuery.matches ||
      constrainedHardware ||
      constrainedNetwork,
    prefersReducedMotion: reducedMotionQuery.matches,
  };
}

export function useAdaptivePerformance() {
  const [performance, setPerformance] =
    useState<AdaptivePerformance>(initialPerformance);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const constrainedDeviceQuery = window.matchMedia(
      "(max-width: 700px), (pointer: coarse), (update: slow)",
    );
    const connection = (
      navigator as NavigatorWithPerformanceHints
    ).connection;
    const syncPreference = () => {
      setPerformance(
        readPerformancePreference(
          reducedMotionQuery,
          constrainedDeviceQuery,
        ),
      );
    };

    syncPreference();
    reducedMotionQuery.addEventListener("change", syncPreference);
    constrainedDeviceQuery.addEventListener("change", syncPreference);
    connection?.addEventListener("change", syncPreference);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncPreference);
      constrainedDeviceQuery.removeEventListener("change", syncPreference);
      connection?.removeEventListener("change", syncPreference);
    };
  }, []);

  return performance;
}
