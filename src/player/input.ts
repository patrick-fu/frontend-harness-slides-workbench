import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { NavigationDirection } from "../navigation";

export const STAGE_PREVIOUS_ZONE_RATIO = 0.2;
export const SWIPE_NAVIGATION_THRESHOLD = 50;
export const MOBILE_TOUCH_QUERY = "(max-width: 767px) and (pointer: coarse)";
const RECENT_TOUCH_WINDOW_MS = 600;

const INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "input",
  "textarea",
  "select",
  "summary",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[contenteditable]",
].join(",");

const SHORTCUT_OWNER_SELECTOR = [
  "input",
  "textarea",
  "select",
  "[role='menu']",
  "[role='menuitem']",
  "[role='menuitemcheckbox']",
  "[role='menuitemradio']",
  "[aria-haspopup='menu'][aria-expanded='true']",
  "[role='dialog']",
  "[aria-haspopup='menu']",
].join(",");

export interface NavigationPoint {
  x: number;
  y: number;
}

export function isInteractivePlayerTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export function getStageTapNavigationDirection(
  clientX: number,
  stageLeft: number,
  stageWidth: number,
): NavigationDirection {
  return clientX - stageLeft < stageWidth * STAGE_PREVIOUS_ZONE_RATIO
    ? "prev"
    : "next";
}

export function getSwipeNavigationDirection(
  start: NavigationPoint,
  end: NavigationPoint,
): NavigationDirection | null {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  if (Math.max(absX, absY) < SWIPE_NAVIGATION_THRESHOLD || absX === absY) {
    return null;
  }
  if (absX > absY) return deltaX < 0 ? "next" : "prev";
  return deltaY < 0 ? "next" : "prev";
}

function ownsAllShortcuts(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const editable = target.closest("[contenteditable]");
  if (editable && editable.getAttribute("contenteditable") !== "false") {
    return true;
  }
  return Boolean(target.closest(SHORTCUT_OWNER_SELECTOR));
}

function ownsPresentationShortcuts(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("button,a[href],summary"));
}

interface PlayerKeyboardOptions {
  pureMode: boolean;
  onNext: () => void;
  onPrev: () => void;
  onExitPure: () => void;
  onSearch: () => void;
  onControls: () => void;
}

export function usePlayerKeyboard({
  pureMode,
  onNext,
  onPrev,
  onExitPure,
  onSearch,
  onControls,
}: PlayerKeyboardOptions) {
  const optionsRef = useRef({
    pureMode,
    onNext,
    onPrev,
    onExitPure,
    onSearch,
    onControls,
  });
  optionsRef.current = {
    pureMode,
    onNext,
    onPrev,
    onExitPure,
    onSearch,
    onControls,
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (ownsAllShortcuts(event.target)) return;
      const current = optionsRef.current;
      const presentationKey =
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft" ||
        event.key === " " ||
        event.key === "Spacebar";
      if (presentationKey && ownsPresentationShortcuts(event.target)) return;

      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k" &&
        !current.pureMode
      ) {
        event.preventDefault();
        current.onSearch();
        return;
      }
      if (event.key === "Escape" && current.pureMode) {
        event.preventDefault();
        current.onExitPure();
        return;
      }
      if (
        event.key === "?" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !current.pureMode
      ) {
        event.preventDefault();
        current.onControls();
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        current.onPrev();
      } else if (
        event.key === "ArrowRight" ||
        event.key === " " ||
        event.key === "Spacebar"
      ) {
        event.preventDefault();
        current.onNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

interface PlayerTouchOptions {
  elementRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function usePlayerTouch({
  elementRef,
  enabled,
  onNext,
  onPrev,
}: PlayerTouchOptions) {
  const callbacksRef = useRef({ onNext, onPrev });
  callbacksRef.current = { onNext, onPrev };
  const startRef = useRef<{ identifier: number; point: NavigationPoint } | null>(
    null,
  );
  const lastTouchAtRef = useRef(0);
  const markRecentTouch = useCallback(() => {
    lastTouchAtRef.current = Date.now();
  }, []);
  const wasRecentTouch = useCallback(
    () => Date.now() - lastTouchAtRef.current < RECENT_TOUCH_WINDOW_MS,
    [],
  );

  useEffect(() => {
    if (!enabled) return;
    const stage = elementRef.current;
    if (!stage) return;

    const invalidTouchEvent = (event: TouchEvent) =>
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey;

    const handleTouchStart = (event: TouchEvent) => {
      if (
        invalidTouchEvent(event) ||
        event.touches.length !== 1 ||
        isInteractivePlayerTarget(event.target)
      ) {
        startRef.current = null;
        return;
      }
      const touch = event.touches[0];
      if (!touch) return;
      startRef.current = {
        identifier: touch.identifier,
        point: { x: touch.clientX, y: touch.clientY },
      };
    };

    const handleTouchEnd = (event: TouchEvent) => {
      markRecentTouch();
      const start = startRef.current;
      startRef.current = null;
      if (
        !start ||
        invalidTouchEvent(event) ||
        isInteractivePlayerTarget(event.target)
      ) {
        return;
      }
      const touch = Array.from(event.changedTouches).find(
        (candidate) => candidate.identifier === start.identifier,
      );
      if (!touch) return;
      const end = { x: touch.clientX, y: touch.clientY };
      const swipe = getSwipeNavigationDirection(start.point, end);
      if (swipe) {
        callbacksRef.current[swipe === "next" ? "onNext" : "onPrev"]();
        return;
      }
      const distance = Math.max(
        Math.abs(end.x - start.point.x),
        Math.abs(end.y - start.point.y),
      );
      if (distance >= SWIPE_NAVIGATION_THRESHOLD) return;
      const rect = stage.getBoundingClientRect();
      const tap = getStageTapNavigationDirection(
        start.point.x,
        rect.left,
        rect.width,
      );
      callbacksRef.current[tap === "next" ? "onNext" : "onPrev"]();
    };

    const clearTouch = () => {
      startRef.current = null;
    };
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchend", handleTouchEnd, { passive: true });
    stage.addEventListener("touchcancel", clearTouch, { passive: true });
    return () => {
      stage.removeEventListener("touchstart", handleTouchStart);
      stage.removeEventListener("touchend", handleTouchEnd);
      stage.removeEventListener("touchcancel", clearTouch);
      startRef.current = null;
    };
  }, [elementRef, enabled, markRecentTouch]);

  return { markRecentTouch, wasRecentTouch };
}
