"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      elements.forEach((node) => node.classList.add("animate-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const animationName = entry.target.getAttribute("data-animate");
          const delay = Number(entry.target.getAttribute("data-delay") || 0);

          entry.target.classList.add("animate-in");

          const variants = {
            fadeIn: { opacity: 1, x: 0, y: 0, duration: 0.8 },
            fadeInFromTop: { opacity: 1, x: 0, y: 0, duration: 0.85, fromY: -72 },
            fadeInFromBottom: { opacity: 1, x: 0, y: 0, duration: 0.9, fromY: 80 },
            fadeInFromBottomSm: { opacity: 1, x: 0, y: 0, duration: 0.75, fromY: 32 },
            fadeInFromLeft: { opacity: 1, x: 0, y: 0, duration: 0.85, fromX: -72 },
            fadeInFromRight: { opacity: 1, x: 0, y: 0, duration: 0.85, fromX: 72 }
          };

          const variant = variants[animationName] || variants.fadeIn;

          gsap.fromTo(
            entry.target,
            {
              opacity: 0,
              x: variant.fromX || 0,
              y: variant.fromY || 0
            },
            {
              opacity: variant.opacity,
              x: variant.x,
              y: variant.y,
              duration: variant.duration,
              delay,
              ease: "power3.out",
              overwrite: true
            }
          );

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );

    elements.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
}
