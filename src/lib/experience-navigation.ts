const skipOpeningSequenceOnceKey = "jps:skip-opening-sequence-once";

export function requestOpeningSequenceSkip() {
  try {
    window.sessionStorage.setItem(skipOpeningSequenceOnceKey, "true");
  } catch {
    // Session storage can be unavailable in restricted browsing contexts.
  }
}

export function consumeOpeningSequenceSkip() {
  try {
    const shouldSkip = window.sessionStorage.getItem(skipOpeningSequenceOnceKey) === "true";

    if (shouldSkip) {
      window.sessionStorage.removeItem(skipOpeningSequenceOnceKey);
    }

    return shouldSkip;
  } catch {
    return false;
  }
}
