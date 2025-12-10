import { useEffect, useRef, useState } from "react";
import { Meal } from "../../mealTypes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { deleteMeal } from "../../mealSlices/mealSlice";

export default function MealCard({
  meal,
  onOpenModal,
}: {
  meal: Meal;
  onOpenModal: (meal: Meal) => void;
}) {
  const dispatch = useAppDispatch();

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
    e.preventDefault();
  };

  const handleClick = () => {
    if (swipeOffset === 0) {
      onOpenModal(meal);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${meal.mealType} meal?`)) {
      dispatch(deleteMeal(meal.id));
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const currentX = e.clientX;
      const diff = startX.current - currentX;

      // Тягнемо вліво (відкриваємо)
      if (diff >= 0 && diff <= 60) {
        setSwipeOffset(diff);
      }
      // Тягнемо вправо (закриваємо)
      else if (diff < 0 && swipeOffset > 0) {
        const newOffset = Math.max(0, swipeOffset + diff);
        setSwipeOffset(newOffset);
        startX.current = currentX;
      }
    };

    const handleGlobalMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      // Якщо більше ніж на 40px - залишаємо відкритим, інакше закриваємо
      if (swipeOffset > 40) {
        setSwipeOffset(60);
      } else {
        setSwipeOffset(0);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, swipeOffset]);

  const isDeleted = useAppSelector((state) => state.deleteMeal.isDeleted);
  const loading = useAppSelector((state) => state.deleteMeal.loading);

  useEffect(() => {
    if (isDeleted && !loading) {
      window.location.reload();
    }
  }, [isDeleted, loading]);

  return (
    <>
      <div className="meal-row-wrapper">
        <div
          className="meal-row"
          style={{
            transform: `translateX(-${swipeOffset}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
        >
          <div className="meal-left">
            <div className={`meal-icon meal-icon--${meal.mealType}`} />

            <div className="meal-info">
              <h2 className="meal-title">{meal.mealType}</h2>
              <span>{meal.summary.kcal.toFixed(0)}kcal</span>
            </div>
          </div>
          <button
            type="button"
            className="meal-add-btn"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Add food to ${meal.mealType}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
            </svg>
          </button>
        </div>
        <button
          className="meal-delete-btn"
          onClick={handleDelete}
          style={{
            opacity: swipeOffset > 0 ? 1 : 0,
            pointerEvents: swipeOffset > 0 ? "auto" : "none",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {/* <div className="meal-row" onClick={() => onOpenModal(meal)}>
        <div className="meal-left">
          <div className={`meal-icon meal-icon--${meal.mealType}`} />

          <div className="meal-info">
            <h2 className="meal-title">{meal.mealType}</h2>
            <span>{meal.summary.kcal.toFixed(0)}kcal</span>
          </div>
        </div>
        <button
          type="button"
          className="meal-add-btn"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Add food to ${meal.mealType}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
          </svg>
        </button>
      </div> */}
    </>
  );
}
