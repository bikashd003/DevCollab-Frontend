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
} from 'lucide-react';

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
    const tip: FeatureTip = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      ...tipConfig,
    };
    setFeatureTips((prev: FeatureTip[]) => [...prev, tip]);

    // Auto-hide after duration
    if (tip.duration) {
      setTimeout(() => hideFeatureTip(tip.id), tip.duration);
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
    const newHighlights: HighlightRect[] = [];
    highlightedElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        newHighlights.push({
          selector,
          rect: {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          },
        });
      }
    });
    setHighlights(newHighlights);
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
          className="absolute border-2 border-blue-500 rounded-lg shadow-lg animate-pulse"
          style={{
            top: highlight.rect.top - 4,
            left: highlight.rect.left - 4,
            width: highlight.rect.width + 8,
            height: highlight.rect.height + 8,
            background: 'rgba(59, 130, 246, 0.1)',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
          }}
        >
          <div className="absolute inset-0 border-2 border-blue-400 rounded-lg" />
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

  const handleSeek = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime;
      setCurrentTime(newTime);
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
      <div className={`relative ${className}`}>
        <img
          src={media.url}
          alt={media.alt || 'Feature demonstration'}
          className="w-full h-auto rounded-lg"
        />
        {media.type === 'gif' && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            GIF
          </div>
        )}
      </div>
    );
  }

  if (media.type === 'video') {
    return (
      <div className={`relative ${className}`}>
        <video
          ref={mediaRef}
          src={media.url}
          className="w-full h-auto rounded-lg"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          muted
          playsInline
        />

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 rounded-b-lg">
          <div className="flex items-center gap-3 text-white">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div
              className="flex-1 h-1 bg-white bg-opacity-30 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full transition-all duration-150"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            <button
              onClick={resetVideo}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
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
      const element = document.querySelector(currentStep.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });

        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    // Position tooltip based on target element position
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let tooltipTop = top + height + tooltipOffset;
    let tooltipLeft = left + width / 2;
    let transform = 'translateX(-50%)';

    // Adjust if tooltip would go off screen
    if (tooltipTop + 300 > viewportHeight) {
      tooltipTop = top - tooltipOffset;
      transform = 'translateX(-50%) translateY(-100%)';
    }

    if (tooltipLeft - 200 < 0) {
      tooltipLeft = left;
      transform = transform.replace('translateX(-50%)', 'translateX(0)');
    } else if (tooltipLeft + 200 > viewportWidth) {
      tooltipLeft = left + width;
      transform = transform.replace('translateX(-50%)', 'translateX(-100%)');
    }

    return {
      top: `${tooltipTop}px`,
      left: `${tooltipLeft}px`,
      transform,
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40" />

      {/* Target Spotlight */}
      {targetPosition && (
        <div
          className="fixed z-50 pointer-events-none animate-pulse"
          style={{
            top: targetPosition.top - 8,
            left: targetPosition.left - 8,
            width: targetPosition.width + 16,
            height: targetPosition.height + 16,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 50px rgba(59, 130, 246, 0.3)',
          }}
        />
      )}

      {/* Tour Tooltip */}
      <div className="fixed z-50 pointer-events-auto" style={getTooltipPosition()}>
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md border border-gray-200">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{currentStep.title}</h3>
              <p className="text-sm text-gray-500">
                Step {tourState.currentStep + 1} of {tourState.steps.length}
              </p>
            </div>
            {tourState.settings.skipable && (
              <button onClick={onEnd} className="text-gray-400 hover:text-gray-600 p-1">
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
            <p className="text-gray-700 leading-relaxed">{currentStep.content}</p>

            {currentStep.highlights && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">Key Points:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {currentStep.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={onPrev}
              disabled={isFirstStep}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {/* Progress dots */}
              <div className="flex gap-1">
                {tourState.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === tourState.currentStep
                        ? 'bg-blue-500'
                        : index < tourState.currentStep
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={isLastStep ? onEnd : onNext}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
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
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    } as const;
    return tip.position ? positions[tip.position] : 'top-4 right-4';
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} pointer-events-auto max-w-sm animate-slideIn`}
    >
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-2xl border border-purple-400">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg">{tip.title}</h3>
                {tip.isNew && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
              </div>
              <p className="text-sm opacity-90 mb-4">{tip.content}</p>

              {/* Media */}
              {tip.media && (
                <div className="mb-4">
                  <MediaPlayer media={tip.media} />
                </div>
              )}

              {/* Actions */}
              {tip.actions && (
                <div className="flex gap-2">
                  {tip.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        action.variant === 'primary'
                          ? 'bg-white text-purple-600 hover:bg-gray-100 shadow-md'
                          : 'bg-white bg-opacity-20 hover:bg-opacity-30'
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
            className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { TipsProvider, useTips, FeatureTipsRenderer, MediaPlayer };
