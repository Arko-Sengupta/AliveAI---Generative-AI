import { useEffect, useRef } from "react";
import "../../StyleSheets/Animations.css";

const useScrollAnimation = (ref) => {
  useEffect(() => {
    const CheckPosition = () => {
      if (ref.current) {
        const position = ref.current.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
          ref.current.classList.add("slide-up-show");
        }
      }
    };

    window.addEventListener("scroll", CheckPosition);
    window.addEventListener("resize", CheckPosition);

    CheckPosition();

    return () => {
      window.removeEventListener("scroll", CheckPosition);
      window.removeEventListener("resize", CheckPosition);
    };
  }, [ref]);
};

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