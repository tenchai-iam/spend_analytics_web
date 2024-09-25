import React, { useEffect, useRef } from "react";
import "../ComponentsStyles/NewsTicker.css"; // Import CSS styles

const NewsTicker = ({ newsItems }) => {
  const tickerRef = useRef(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (ticker) {
      const scrollSpeed = 2; // Adjust this value to control scrolling speed
      let scrollAmount = 0;

      const scroll = () => {
        scrollAmount -= scrollSpeed;
        if (scrollAmount <= -ticker.scrollWidth) {
          scrollAmount = ticker.offsetWidth;
        }
        ticker.style.transform = `translateX(${scrollAmount}px)`;
        requestAnimationFrame(scroll);
      };

      scroll();

      return () => {
        cancelAnimationFrame(scroll); // Cleanup on component unmount
      };
    }
  }, []);

  return (
    <div className="news-ticker-container">
      <div className="news-ticker" ref={tickerRef}>
        {newsItems.map((item, index) => (
          <span key={index} className="news-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
