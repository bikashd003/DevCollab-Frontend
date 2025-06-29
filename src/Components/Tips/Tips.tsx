import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import './Tips.css';
import { toast } from 'sonner';
// Define the types
interface FeatureTip {
  id: number | string;
  timestamp: number;
  content?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  title?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  [key: string]: any; // For any additional properties
}

interface TourStep {
  target?: string;
  content: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlights?: string[];
  media?: {
    type: 'image' | 'video';
    url: string;
    alt?: string;
  };
}

interface TourState {
  active: boolean;
  currentStep: number;
  steps: TourStep[];
  settings: {
    skipable: boolean;
    pausable: boolean;
  };
}

// Define the context type
interface TipsContextType {
  startGuidedTour: (tourConfig: { steps: TourStep[] }) => void;
  showFeatureTip: (tip: Omit<FeatureTip, 'id' | 'timestamp'>) => void;
  hideFeatureTip: (id: string | number) => void;
  highlightElement: (selector: string) => void;
  removeHighlight: (selector: string) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  guidedTour: TourState;
  featureTips: FeatureTip[];
  highlightedElements: Set<string>;
}

// Create the context with a default value
const TipsContext = React.createContext<TipsContextType | undefined>(undefined);

// Tips Provider Component
const TipsProvider = ({ children }: { children: React.ReactNode }) => {
  const [guidedTour, setGuidedTour] = useState({
    active: false,
    currentStep: 0,
    steps: [],
    settings: { skipable: true, pausable: true },
  });
  const [featureTips, setFeatureTips] = useState<FeatureTip[]>([]);
  const [highlightedElements, setHighlightedElements] = useState<Set<string>>(new Set());

  const startGuidedTour = useCallback((tourConfig: any) => {
    setGuidedTour({
      active: true,
      currentStep: 0,
      steps: tourConfig.steps,
      settings: { skipable: true, pausable: true, ...tourConfig.settings },
    });
  }, []);

  const nextTourStep = useCallback(() => {
    setGuidedTour(prev => ({
      ...prev,
      currentStep:
        prev.currentStep + 1 < prev.steps.length ? prev.currentStep + 1 : prev.currentStep,
    }));
  }, []);

  const prevTourStep = useCallback(() => {
    setGuidedTour(prev => ({
      ...prev,
      currentStep: prev.currentStep > 0 ? prev.currentStep - 1 : 0,
    }));
  }, []);

  const endTour = useCallback(() => {
    setGuidedTour({
      active: false,
      currentStep: 0,
      steps: [],
      settings: { skipable: true, pausable: true },
    });
    setHighlightedElements(new Set());
  }, []);

  const showFeatureTip = useCallback((tipConfig: Omit<FeatureTip, 'id' | 'timestamp'>) => {
    try {
      const tip: FeatureTip = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        ...tipConfig,
      };
      setFeatureTips((prev: FeatureTip[]) => [...prev, tip]);

      // Auto-hide after duration
      if (tip.duration && tip.duration > 0) {
        setTimeout(() => hideFeatureTip(tip.id), tip.duration);
      }
    } catch (error) {
      toast.error('Failed to show feature tip. Please try again.', {
        description: 'An error occurred while trying to show the feature tip.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hideFeatureTip = useCallback((tipId: string | number) => {
    setFeatureTips((prev: FeatureTip[]) => prev.filter(tip => tip.id !== tipId));
  }, []);

  const highlightElement = useCallback((selector: string) => {
    setHighlightedElements(prev => new Set([...prev, selector]));
  }, []);

  const removeHighlight = useCallback((selector: string) => {
    setHighlightedElements(prev => {
      const newSet = new Set(prev);
      newSet.delete(selector);
      return newSet;
    });
  }, []);

  const contextValue = {
    startGuidedTour,
    nextTourStep,
    prevTourStep,
    endTour,
    showFeatureTip,
    hideFeatureTip,
    highlightElement,
    removeHighlight,
    guidedTour,
    featureTips,
    highlightedElements,
  };

  return (
    <TipsContext.Provider value={contextValue}>
      {children}
      <ElementHighlighter highlightedElements={highlightedElements} />
      <GuidedTourRenderer
        tourState={guidedTour}
        onNext={nextTourStep}
        onPrev={prevTourStep}
        onEnd={endTour}
      />
      <FeatureTipsRenderer tips={featureTips} onHide={hideFeatureTip} />
    </TipsContext.Provider>
  );
};

// Hook
const useTips = () => {
  const context = React.useContext(TipsContext);
  if (!context) {
    throw new Error('useTips must be used within a TipsProvider');
  }
  return context;
};

// Element Highlighter Component
interface HighlightRect {
  selector: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const ElementHighlighter = ({ highlightedElements }: { highlightedElements: Set<string> }) => {
  const [highlights, setHighlights] = useState<HighlightRect[]>([]);

  const updateHighlights = useCallback(() => {
    try {
      const newHighlights: HighlightRect[] = [];
      highlightedElements.forEach(selector => {
        try {
          const element = document.querySelector(selector);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              newHighlights.push({
                selector,
                rect: {
                  top: rect.top + (window.scrollY || 0),
                  left: rect.left + (window.scrollX || 0),
                  width: rect.width,
                  height: rect.height,
                },
              });
            }
          }
        } catch (error) {
          toast.error('Failed to update highlights. Please try again.', {
            description: 'An error occurred while trying to update the highlights.',
          });
        }
      });
      setHighlights(newHighlights);
    } catch (error) {
      toast.error('Failed to update highlights. Please try again.', {
        description: 'An error occurred while trying to update the highlights.',
      });
    }
  }, [highlightedElements]);

  useEffect(() => {
    if (highlightedElements.size > 0) {
      updateHighlights();
      window.addEventListener('resize', updateHighlights);
      window.addEventListener('scroll', updateHighlights);

      return () => {
        window.removeEventListener('resize', updateHighlights);
        window.removeEventListener('scroll', updateHighlights);
      };
    }
  }, [highlightedElements, updateHighlights]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {highlights.map(highlight => (
        <div
          key={highlight.selector}
          className="absolute rounded-xl transition-all duration-300 ease-out"
          style={{
            top: highlight.rect.top - 6,
            left: highlight.rect.left - 6,
            width: highlight.rect.width + 12,
            height: highlight.rect.height + 12,
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            boxShadow: `
              0 0 0 2px rgba(99, 102, 241, 0.4),
              0 8px 32px rgba(99, 102, 241, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

// Media Player Component
const MediaPlayer = ({ media, className = '' }: { media: any; className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;

      if (mediaRef.current && !isNaN(newTime) && isFinite(newTime)) {
        mediaRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    } catch (error) {
      toast.error('Failed to seek video. Please try again.', {
        description: 'An error occurred while trying to seek the video.',
      });
    }
  };

  const resetVideo = () => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      mediaRef.current.pause();
    }
  };

  if (media.type === 'image' || media.type === 'gif') {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <img
          src={media.url}
          alt={media.alt || 'Feature demonstration'}
          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {media.type === 'gif' && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            GIF
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    );
  }

  if (media.type === 'video') {
    return (
      <div className={`relative ${className}`}>
        <video
          ref={mediaRef}
          src={media.url}
          className="w-full h-auto rounded-xl object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          muted
          playsInline
          preload="metadata"
        />

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-xl">
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <div
              className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer backdrop-blur-sm hover:bg-white/30 transition-colors"
              onClick={handleSeek}
              role="slider"
              aria-label="Video progress"
            >
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-150 shadow-sm"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            <button
              onClick={resetVideo}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Reset video"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Guided Tour Renderer
interface GuidedTourRendererProps {
  tourState: TourState;
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
}

const GuidedTourRenderer = ({ tourState, onNext, onPrev, onEnd }: GuidedTourRendererProps) => {
  interface Position {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  const [targetPosition, setTargetPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (!tourState.active || tourState.steps.length === 0) return;

    const currentStep = tourState.steps[tourState.currentStep];

    if (currentStep.target) {
      try {
        const element = document.querySelector(currentStep.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setTargetPosition({
              top: rect.top + (window.scrollY || 0),
              left: rect.left + (window.scrollX || 0),
              width: rect.width,
              height: rect.height,
            });

            // Scroll element into view with error handling
            try {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (scrollError) {
              // Fallback for browsers that don't support smooth scrolling
              element.scrollIntoView();
            }
          }
        }
      } catch (error) {
        toast.error('Failed to target element. Please try again.', {
          description: 'An error occurred while trying to target the element.',
        });
      }
    }
  }, [tourState.currentStep, tourState.active, tourState.steps]);

  if (!tourState.active || tourState.steps.length === 0) return null;

  const currentStep = tourState.steps[tourState.currentStep];
  const isLastStep = tourState.currentStep === tourState.steps.length - 1;
  const isFirstStep = tourState.currentStep === 0;

  const getTooltipPosition = () => {
    if (!targetPosition) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const { top, left, width, height } = targetPosition;
    const tooltipOffset = 20;
    const tooltipWidth = 400; // Approximate tooltip width
    const tooltipHeight = 300; // Approximate tooltip height

    // Position tooltip based on target element position
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    let tooltipTop = top + height + tooltipOffset;
    let tooltipLeft = left + width / 2;
    let transform = 'translateX(-50%)';

    // Adjust if tooltip would go off screen
    if (tooltipTop + tooltipHeight > viewportHeight) {
      tooltipTop = Math.max(tooltipOffset, top - tooltipHeight - tooltipOffset);
      transform = 'translateX(-50%) translateY(0)';
    }

    if (tooltipLeft - tooltipWidth / 2 < 0) {
      tooltipLeft = Math.max(tooltipOffset, left);
      transform = transform.replace('translateX(-50%)', 'translateX(0)');
    } else if (tooltipLeft + tooltipWidth / 2 > viewportWidth) {
      tooltipLeft = Math.min(viewportWidth - tooltipOffset, left + width);
      transform = transform.replace('translateX(-50%)', 'translateX(-100%)');
    }

    return {
      top: `${Math.max(0, tooltipTop)}px`,
      left: `${Math.max(0, tooltipLeft)}px`,
      transform,
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300" />

      {/* Target Spotlight */}
      {targetPosition && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-500 ease-out"
          style={{
            top: targetPosition.top - 12,
            left: targetPosition.left - 12,
            width: targetPosition.width + 24,
            height: targetPosition.height + 24,
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
            borderRadius: '16px',
            boxShadow: `
              0 0 0 3px rgba(99, 102, 241, 0.6),
              0 0 0 6px rgba(99, 102, 241, 0.3),
              0 20px 60px rgba(99, 102, 241, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.8)
            `,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}

      {/* Tour Tooltip */}
      <div
        className="fixed z-50 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300"
        style={getTooltipPosition()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-md border border-white/20 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 -z-10" />

          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-xl leading-tight">{currentStep.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-600">
                    Step {tourState.currentStep + 1} of {tourState.steps.length}
                  </span>
                </div>
              </div>
            </div>
            {tourState.settings.skipable && (
              <button
                onClick={onEnd}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
                aria-label="Close tour"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Media */}
          {currentStep.media && (
            <div className="mb-4">
              <MediaPlayer media={currentStep.media} />
            </div>
          )}

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-base">{currentStep.content}</p>

            {currentStep.highlights && (
              <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-900 text-sm">Key Points</h4>
                </div>
                <ul className="text-sm text-blue-800 space-y-2">
                  {currentStep.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onPrev}
              disabled={isFirstStep}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {/* Progress dots */}
              <div className="flex gap-2">
                {tourState.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === tourState.currentStep
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125 shadow-lg'
                        : index < tourState.currentStep
                          ? 'bg-green-500 shadow-sm'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={isLastStep ? onEnd : onNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
            >
              {isLastStep ? 'Finish Tour' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Feature Tips Renderer
interface FeatureTipsRendererProps {
  tips: FeatureTip[];
  onHide: (id: string | number) => void;
}

const FeatureTipsRenderer = ({ tips, onHide }: FeatureTipsRendererProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {tips.map(tip => (
        <FeatureTip key={tip.id} tip={tip} onHide={onHide} />
      ))}
    </div>
  );
};

// Individual Feature Tip Component
interface FeatureTipProps {
  tip: FeatureTip;
  onHide: (id: string | number) => void;
}

const FeatureTip = ({ tip, onHide }: FeatureTipProps) => {
  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6',
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    } as const;
    return tip.position ? positions[tip.position] : 'top-6 right-6';
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} pointer-events-auto max-w-sm animate-in slide-in-from-right-4 duration-300`}
    >
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mt-1 shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-bold text-xl leading-tight">{tip.title}</h3>
                  {tip.isNew && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-95 leading-relaxed mb-5">{tip.content}</p>

                {/* Media */}
                {tip.media && (
                  <div className="mb-5">
                    <MediaPlayer media={tip.media} />
                  </div>
                )}

                {/* Actions */}
                {tip.actions && (
                  <div className="flex gap-3 flex-wrap">
                    {tip.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 ${
                          action.variant === 'primary'
                            ? 'bg-white text-purple-700 hover:bg-gray-50 shadow-xl'
                            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => onHide(tip.id)}
              className="flex-shrink-0 hover:bg-white/20 rounded-xl p-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close tip"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TipsProvider, useTips, FeatureTipsRenderer, MediaPlayer };
