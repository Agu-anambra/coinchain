import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const revealSections = document.querySelectorAll('[data-section]');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealSections.forEach(section => observer.observe(section));
  }, []);
}
