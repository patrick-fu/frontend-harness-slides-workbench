import { useState, useRef, useCallback, useEffect } from "react";
import type { StyleRegistryEntry } from "../../types";
import {
  BAND_LABELS,
  groupByBand,
  type BandId,
} from "./bands";

export interface SidebarProps {
  registry: StyleRegistryEntry[];
  currentStyleId: string;
  currentVersionId: string;
  onSelectStyle: (id: string) => void;
  onSelectVersion: (styleId: string, versionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "zh";
  width: number;
  onWidthChange: (w: number) => void;
  collapsed: boolean;
}

const MIN_WIDTH = 240;
const MAX_WIDTH = 360;
const COLLAPSED_WIDTH = 48;

export default function Sidebar({
  registry,
  currentStyleId,
  currentVersionId,
  onSelectStyle,
  onSelectVersion,
  isOpen,
  onClose,
  language,
  width,
  onWidthChange,
  collapsed,
}: SidebarProps) {
  const [collapsedBands, setCollapsedBands] = useState<Set<BandId>>(new Set());
  const [expandedStyles, setExpandedStyles] = useState<Set<string>>(
    () => new Set([currentStyleId]),
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(width);

  const grouped = groupByBand(registry);

  // Auto-expand the current style's section
  useEffect(() => {
    setExpandedStyles((prev) => {
      const next = new Set(prev);
      next.add(currentStyleId);
      return next;
    });
  }, [currentStyleId]);

  // ── Band section collapse ────────────────────────────────────────────────

  const toggleBand = useCallback((band: BandId) => {
    setCollapsedBands((prev) => {
      const next = new Set(prev);
      if (next.has(band)) {
        next.delete(band);
      } else {
        next.add(band);
      }
      return next;
    });
  }, []);

  // ── Style expand/collapse ───────────────────────────────────────────────

  const toggleStyleExpand = useCallback((styleId: string) => {
    setExpandedStyles((prev) => {
      const next = new Set(prev);
      if (next.has(styleId)) {
        next.delete(styleId);
      } else {
        next.add(styleId);
      }
      return next;
    });
  }, []);

  // ── Resize drag ──────────────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (collapsed) return;
      e.preventDefault();
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = width;
    },
    [collapsed, width],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current;
      const next = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, dragStartWidth.current + delta),
      );
      onWidthChange(next);
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, onWidthChange]);

  // ── Style click ──────────────────────────────────────────────────────────

  const handleStyleClick = useCallback(
    (id: string) => {
      onSelectStyle(id);
      onClose();
    },
    [onSelectStyle, onClose],
  );

  const handleVersionClick = useCallback(
    (styleId: string, versionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onSelectVersion(styleId, versionId);
      onClose();
    },
    [onSelectVersion, onClose],
  );

  // ── Render ───────────────────────────────────────────────────────────────

  const effectiveWidth = collapsed ? COLLAPSED_WIDTH : width;

  const sidebarClasses = [
    "fixed md:fixed top-0 left-0 h-full z-40",
    "bg-chrome text-chrome-ink border-r border-ink/10",
    "flex flex-col",
    "transition-transform duration-200 md:transition-none",
    // Mobile: slide in from left
    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
    // Desktop: when collapsed on desktop, still show (translate-x-0)
  ].join(" ");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        data-testid="sidebar"
        className={sidebarClasses}
        style={{
          width: effectiveWidth,
          paddingTop: "36px",
          paddingBottom: "36px",
          top: 0,
          userSelect: isDragging ? "none" : undefined,
        }}
        aria-label="Style navigation"
      >
        {/* Band sections — scrollable area */}
        <div className="flex-1 overflow-y-auto py-1">
          {grouped.map(([band, entries]) => {
            if (entries.length === 0) return null;
            const isBandCollapsed = collapsedBands.has(band);
            const bandLabel = BAND_LABELS[band][language];

            return (
              <div
                key={band}
                data-testid={`band-section-${band}`}
                data-collapsed={isBandCollapsed}
                className="mb-1"
              >
                {/* Band header */}
                <button
                  type="button"
                  data-testid={`band-toggle-${band}`}
                  onClick={() => toggleBand(band)}
                  className="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink/50 hover:bg-ink/5 transition-colors"
                  aria-expanded={!isBandCollapsed}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 transition-transform"
                    style={{
                      transform: isBandCollapsed
                        ? "rotate(-90deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <polyline points="2,4 6,8 10,4" />
                  </svg>
                  {!collapsed && (
                    <span className="truncate">{bandLabel}</span>
                  )}
                </button>

                {/* Style entries */}
                {!isBandCollapsed && (
                  <ul role="tree" className="mt-0.5">
                    {entries.map((entry) => {
                      const isCurrent = entry.id === currentStyleId;
                      const isExpanded = expandedStyles.has(entry.id);
                      const hasMultipleVersions = entry.versions.length > 1;
                      const styleName = entry.name[language];

                      return (
                        <li key={entry.id} role="none">
                          <button
                            type="button"
                            role="treeitem"
                            data-testid={`sidebar-style-${entry.id}`}
                            onClick={() => handleStyleClick(entry.id)}
                            aria-current={isCurrent ? "true" : undefined}
                            aria-expanded={isExpanded}
                            className={[
                              "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-colors",
                              "rounded-md mx-1",
                              isCurrent
                                ? "bg-ink/10 font-medium"
                                : "hover:bg-ink/5",
                            ].join(" ")}
                            title={collapsed ? styleName : undefined}
                          >
                            <span className="shrink-0 text-xs font-mono text-ink/40 w-6 text-center">
                              {entry.id}
                            </span>
                            {!collapsed && (
                              <>
                                <span className="truncate flex-1">
                                  {styleName}
                                </span>
                                {hasMultipleVersions && (
                                  <span
                                    className="shrink-0 text-[10px] text-ink/40 font-mono"
                                    title={`${entry.versions.length} versions`}
                                  >
                                    ×{entry.versions.length}
                                  </span>
                                )}
                                {hasMultipleVersions && (
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="shrink-0 text-ink/30 transition-transform cursor-pointer"
                                    style={{
                                      transform: isExpanded
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStyleExpand(entry.id);
                                    }}
                                  >
                                    <polyline points="2,4 6,8 10,4" />
                                  </svg>
                                )}
                              </>
                            )}
                          </button>

                          {/* Version sub-list */}
                          {!collapsed && isExpanded && hasMultipleVersions && (
                            <ul className="mt-0.5 ml-7">
                              {entry.versions.map((v) => {
                                const isCurrentVersion =
                                  isCurrent && v.id === currentVersionId;
                                return (
                                  <li key={v.id}>
                                    <button
                                      type="button"
                                      data-testid={`sidebar-version-${entry.id}-${v.id}`}
                                      onClick={(e) =>
                                        handleVersionClick(
                                          entry.id,
                                          v.id,
                                          e,
                                        )
                                      }
                                      className={[
                                        "w-full flex items-center gap-1.5 px-2 py-1 text-left text-xs transition-colors rounded",
                                        isCurrentVersion
                                          ? "bg-ink/[0.07] font-medium text-ink"
                                          : "text-ink/60 hover:bg-ink/5 hover:text-ink/80",
                                      ].join(" ")}
                                    >
                                      <span className="truncate flex-1">
                                        {v.topic}
                                      </span>
                                      <span className="shrink-0 text-[9px] text-ink/30 font-mono">
                                        {v.model}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Resize handle (desktop, not collapsed) */}
        {!collapsed && (
          <div
            className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group"
            onMouseDown={handleDragStart}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-ink/10 group-hover:bg-ink/25 rounded-full transition-colos" />
          </div>
        )}
      </aside>
    </>
  );
}
