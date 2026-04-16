"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Custom hook for intersection observer animations
export const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);

  return { isVisible, elementRef };
};

// Custom hook for counter animations
export const useCounter = (targetValue, duration = 2000, isVisible = false) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);

      // Extract numeric value and suffix
      const numericValue = parseInt(targetValue.replace(/[^0-9]/g, ""));
      const suffix = targetValue.replace(/[0-9]/g, "");

      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(
          startValue + (numericValue - startValue) * easeOutQuart
        );

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(numericValue);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, hasAnimated, targetValue, duration]);

  return (
    count +
    (targetValue.includes("+") ? "+" : "") +
    (targetValue.includes("%") ? "%" : "")
  );
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");
  const [dir, setDir] = useState("ltr");

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    const newDir = newLang === "ar" ? "rtl" : "ltr";
    setLang(newLang);
    setDir(newDir);
  };

  const value = {
    lang,
    dir,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
