import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export const AnimatedCounter = ({
    end,
    duration = 2000,
    prefix = '',
    suffix = '',
    className = ''
}: AnimatedCounterProps) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref} className={`animate-count-up ${className}`}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
};

interface RotatingTextProps {
    texts: string[];
    interval?: number;
    className?: string;
}

export const RotatingText = ({
    texts,
    interval = 3000,
    className = ''
}: RotatingTextProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % texts.length);
                setIsAnimating(false);
            }, 300);
        }, interval);

        return () => clearInterval(timer);
    }, [texts.length, interval]);

    return (
        <span
            className={`inline-block transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                } ${className}`}
        >
            {texts[currentIndex]}
        </span>
    );
};

interface ScrollProgressProps {
    className?: string;
}

export const ScrollProgress = ({ className = '' }: ScrollProgressProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / scrollHeight) * 100;
            setProgress(Math.min(scrolled, 100));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (progress < 1) return null;

    return (
        <div
            className={`scroll-progress ${className}`}
            style={{ width: `${progress}%` }}
        />
    );
};

interface LiveIndicatorProps {
    text?: string;
    className?: string;
}

export const LiveIndicator = ({ text, className = '' }: LiveIndicatorProps) => {
    return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
            <span className="live-dot" />
            {text && <span className="text-xs font-medium text-success">{text}</span>}
        </span>
    );
};

export default { AnimatedCounter, RotatingText, ScrollProgress, LiveIndicator };
