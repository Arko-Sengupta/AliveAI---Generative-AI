import { useEffect, useRef } from 'react';
import "../../StyleSheets/Animations.css";

// Slide Up Fade In Component
// Hook Component for Scroll Alert
const useScrollAnimation = (ref) => {
  useEffect(() => {
    const checkPosition = () => {
      if (ref.current) {
        const position = ref.current.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
          ref.current.classList.add('slide-up-show');
        }
      }
    };

    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);

    checkPosition();

    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [ref]);
};

// Slide Up Fade In Component [Main]
const SlideUp = ({ children }) => {
  const ref = useRef(null);
  useScrollAnimation(ref);

  return (
    <div ref={ref} className="slide-up">
      {children}
    </div>
  );
};

export default SlideUp;