import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Animated, View } from 'react-native';

interface Props {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  animationDuration?: number;
  enableFadeTransition?: boolean;
  delay?: number;
}

const InteractionsWrapper: React.FC<Props> = ({
  children,
  fallbackComponent = null,
  animationDuration = 300,
  enableFadeTransition = true,
  delay = 0,
}) => {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef<number | null>(null);

  const startFadeAnimation = useCallback(() => {
    if (enableFadeTransition) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, animationDuration, enableFadeTransition]);

  useEffect(() => {
    // Clear any existing timeouts/requests
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
    }

    // Modern approach: Use requestAnimationFrame + setTimeout
    // This ensures rendering happens after the current frame
    const scheduleReady = () => {
      requestIdRef.current = requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(() => {
          setIsReady(true);
          startFadeAnimation();
        }, delay);
      });
    };

    scheduleReady();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };
  }, [startFadeAnimation, delay]);

  // Render fallback while not ready
  if (!isReady) {
    return fallbackComponent ? <>{fallbackComponent}</> : null;
  }

  // Render with or without fade animation
  if (enableFadeTransition) {
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          flex: 1,
        }}
      >
        {children}
      </Animated.View>
    );
  }

  return <>{children}</>;
};

// Alternative approach using React's built-in scheduling
const InteractionsWrapperWithScheduler: React.FC<Props> = ({
  children,
  fallbackComponent = null,
  animationDuration = 300,
  enableFadeTransition = true,
  delay = 16, // One frame at 60fps
}) => {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Use React's scheduling to defer rendering
    const timeoutId = setTimeout(() => {
      setIsReady(true);

      if (enableFadeTransition) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [fadeAnim, animationDuration, enableFadeTransition, delay]);

  if (!isReady) {
    return fallbackComponent ? <>{fallbackComponent}</> : null;
  }

  if (enableFadeTransition) {
    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {children}
      </Animated.View>
    );
  }

  return <>{children}</>;
};

// React 18+ approach using startTransition (if available)
const InteractionsWrapperModern: React.FC<Props> = ({
  children,
  fallbackComponent = null,
  animationDuration = 300,
  enableFadeTransition = true,
}) => {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if startTransition is available (React 18+)
    if (typeof React !== 'undefined' && 'startTransition' in React) {
      // @ts-ignore - startTransition might not be in older React types
      React.startTransition(() => {
        setIsReady(true);

        if (enableFadeTransition) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
        }
      });
    } else {
      // Fallback for older React versions
      const timeoutId = setTimeout(() => {
        setIsReady(true);

        if (enableFadeTransition) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
        }
      }, 16);

      return () => clearTimeout(timeoutId);
    }
  }, [fadeAnim, animationDuration, enableFadeTransition]);

  if (!isReady) {
    return fallbackComponent ? <>{fallbackComponent}</> : null;
  }

  if (enableFadeTransition) {
    return (
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {children}
      </Animated.View>
    );
  }

  return <>{children}</>;
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('InteractionsWrapper Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.children;
    }
    return this.props.children;
  }
}

// Enhanced version with error boundary
const InteractionsWrapperWithErrorBoundary: React.FC<Props> = props => {
  return (
    <ErrorBoundary>
      <InteractionsWrapper {...props} />
    </ErrorBoundary>
  );
};

// Memoize with custom comparison for better performance
export default React.memo(InteractionsWrapper, (prevProps, nextProps) => {
  return (
    prevProps.children === nextProps.children &&
    prevProps.fallbackComponent === nextProps.fallbackComponent &&
    prevProps.animationDuration === nextProps.animationDuration &&
    prevProps.enableFadeTransition === nextProps.enableFadeTransition
  );
});

// Export alternative approaches
export {
  InteractionsWrapperWithScheduler,
  InteractionsWrapperModern,
  InteractionsWrapperWithErrorBoundary,
};
