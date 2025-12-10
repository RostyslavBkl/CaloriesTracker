import { useState, useEffect } from "react";
import { MealItem } from "../../mealTypes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectUpdatedMealItem } from "../../mealSelectors";
import useMealItemCalculations from "../../mealItenCalc";
import { updateMealItem } from "../../mealSlices/mealItemUpdSlice";

export default function MealItemModal({
  item,
  onCloseItem,
}: {
  item: MealItem;
  onCloseItem: () => void;
}) {
  const dispatch = useAppDispatch();

  const updatedItem = useAppSelector((state) =>
    selectUpdatedMealItem(state, item.id!)
  );
  const currentItem = updatedItem ?? item;

  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState<number>(currentItem.weightG!);

  useEffect(() => {
    setWeight(currentItem.weightG!);
    setIsEditing(false);
  }, [currentItem.weightG]);

  const {
    food,
    actualProteinG,
    actualFatG,
    actualCarbsG,
    proteinKcal,
    fatKcal,
    carbsKcal,
  } = useMealItemCalculations(currentItem);

  const handleBlur = () => {
    const parsed = Number(weight);

    if (!parsed || parsed <= 0) {
      setIsEditing(false);
      setWeight(currentItem.weightG!);
      return;
    }

    console.log("Dispatching with itemId:", item.id);
    dispatch(
      updateMealItem({
        itemId: item.id!,
        dishId: currentItem.dishId ?? null,
        foodId: currentItem.foodId ?? null,
        weightG: parsed,
      })
    );
    setIsEditing(false);
  };

  return (
    <div className="modal-fullscreen ">
      <div className="modal-header-fullscreen">
        <button className="modal-back-arrow" onClick={onCloseItem}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
            <path
              d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z"
              data-name="4-Arrow Left"
              fill="var(--muted)"
            />
          </svg>
        </button>
      </div>

      <div className="modal-meal-info">
        <div className="modal-title-box">
          <p className="item-modal-title">{food.name}</p>
        </div>
        <div className="modal-item-nutr-details">
          <MacronutrientsCircle
            protein={proteinKcal}
            fat={fatKcal}
            carbs={carbsKcal}
            proteinG={actualProteinG}
            fatG={actualFatG}
            carbsG={actualCarbsG}
          />
        </div>
      </div>
      <div className="edit-weight-box">
        <span>Weight</span>
        <div className="edit-weight-btn">
          {isEditing ? (
            <input
              autoFocus
              type="text"
              className="edit-weight-input"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              onBlur={handleBlur}
            />
          ) : (
            <span>{weight} g</span>
          )}
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <svg
              width="24px"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                stroke="var(--muted)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                stroke="var(--muted)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function MacronutrientsCircle({
  protein,
  fat,
  carbs,
  proteinG,
  fatG,
  carbsG,
}: {
  protein: number;
  fat: number;
  carbs: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}) {
  const total = protein + fat + carbs;

  // Якщо немає даних, показуємо пусте коло
  if (total === 0) {
    return (
      <div className="macronutrients-circle-container">
        <svg viewBox="0 0 120 120" className="macronutrients-svg">
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="12"
          />
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            fill="#333"
          >
            0
          </text>
          <text x="60" y="82" textAnchor="middle" fontSize="12" fill="#999">
            kcal
          </text>
        </svg>
      </div>
    );
  }

  // Розраховуємо відсотки
  const proteinPercent = (protein / total) * 100;
  const fatPercent = (fat / total) * 100;
  const carbsPercent = (carbs / total) * 100;

  // Розраховуємо кути для SVG (в градусах)
  const proteinAngle = (proteinPercent / 100) * 360;
  const fatAngle = (fatPercent / 100) * 360;
  const carbsAngle = (carbsPercent / 100) * 360;

  // Функція для конвертування кута в координати на колі
  const angleToCoords = (
    centerX: number,
    centerY: number,
    radius: number,
    angle: number
  ) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  const centerX = 60;
  const centerY = 60;
  const radius = 55;

  // Стартові та кінцеві точки для кожного сегменту
  const proteinStart = angleToCoords(centerX, centerY, radius, 0);
  const proteinEnd = angleToCoords(centerX, centerY, radius, proteinAngle);
  const proteinLargeArc = proteinAngle > 180 ? 1 : 0;

  const fatStart = proteinEnd;
  const fatEnd = angleToCoords(
    centerX,
    centerY,
    radius,
    proteinAngle + fatAngle
  );
  const fatLargeArc = fatAngle > 180 ? 1 : 0;

  const carbsStart = fatEnd;
  const carbsEnd = angleToCoords(centerX, centerY, radius, 360);
  const carbsLargeArc = carbsAngle > 180 ? 1 : 0;

  return (
    <div className="macronutrients-circle-container">
      <svg viewBox="0 0 120 120" className="macronutrients-svg">
        {/* Protein (Red) */}
        {proteinPercent > 0 && (
          <path
            d={`M ${proteinStart.x} ${proteinStart.y} 
      A ${radius} ${radius} 0 ${proteinLargeArc} 1 
      ${proteinEnd.x} ${proteinEnd.y}`}
            stroke="#FF6B6B"
            strokeWidth="6" // ← ось тут міняєш товщину
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Fat (Orange) */}
        <path
          d={`M ${fatStart.x} ${fatStart.y} 
      A ${radius} ${radius} 0 ${fatLargeArc} 1 
      ${fatEnd.x} ${fatEnd.y}`}
          stroke="#FFA94D"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Carbs (Blue) */}
        <path
          d={`M ${carbsStart.x} ${carbsStart.y} 
      A ${radius} ${radius} 0 ${carbsLargeArc} 1 
      ${carbsEnd.x} ${carbsEnd.y}`}
          stroke="#4ECDC4"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Center circle for text */}
        {/* <circle cx={centerX} cy={centerY} r="28" fill="white" /> */}

        {/* Total kcal text */}
        <text
          x={centerX}
          y={62}
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="var(--muted)"
        >
          {Math.round(protein + fat + carbs)}
        </text>
        <text
          x={centerX}
          y={78}
          textAnchor="middle"
          fontSize="12"
          fill="var(--muted)"
        >
          kcal
        </text>
      </svg>

      {/* Legend */}
      <div className="macronutrients-legend">
        <div className="legend-item">
          <div className="legend-text-box">
            <div
              className="legend-color"
              style={{ backgroundColor: "#FF6B6B" }}
            />
            <span className="legend-text">Protein</span>
          </div>
          <div>
            <span>
              {proteinG}g ({proteinPercent.toFixed(0)}%)
            </span>
          </div>
        </div>
        {/* FAT */}
        <div className="legend-item">
          <div className="legend-text-box">
            <div
              className="legend-color"
              style={{ backgroundColor: "#FFA94D" }}
            />
            <span className="legend-text">Fat</span>
          </div>
          <div>
            <span>
              {fatG}g ({fatPercent.toFixed(0)}%)
            </span>
          </div>
        </div>
        <div className="legend-item">
          <div className="legend-text-box">
            <div
              className="legend-color"
              style={{ backgroundColor: "#4ECDC4" }}
            />
            <span className="legend-text">Carbs</span>
          </div>
          <div>
            <span>
              {carbsG}g ({carbsPercent.toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
