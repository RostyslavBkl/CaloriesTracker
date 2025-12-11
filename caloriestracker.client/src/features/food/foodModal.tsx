import { useMemo, useState } from "react";
import { CreateFoodInput } from "./foodType";
import { Food } from "./foodType";
import { MacronutrientsCircle } from "../meal/components/MealItem/MealItemModal";
import React from "react";
import "./food.css";

interface FoodModalProps {
  food?: Food | null;
  onClose: () => void;
  onSubmit: (values: CreateFoodInput) => void;
}

export default function FoodModal({ food, onClose, onSubmit }: FoodModalProps) {
  const isEdit = !!food;

  const [name, setName] = useState(food?.name ?? "");
  const [weightG, setWeightG] = useState<string>(
    food?.weightG != null ? String(food.weightG) : ""
  );
  const [proteinG, setProteinG] = useState<string>(
    food?.proteinG != null ? String(food.proteinG) : ""
  );
  const [fatG, setFatG] = useState<string>(
    food?.fatG != null ? String(food.fatG) : ""
  );
  const [carbsG, setCarbsG] = useState<string>(
    food?.carbsG != null ? String(food.carbsG) : ""
  );

  const { totalKcal, proteinKcal, fatKcal, carbsKcal } = useMemo(() => {
    const w = Number(weightG || 100);
    const p = Number(proteinG || 0);
    const f = Number(fatG || 0);
    const c = Number(carbsG || 0);

    const coeff = w > 0 ? 100 / w : 1;

    const pKcal = p * coeff * 4;
    const fKcal = f * coeff * 9;
    const cKcal = c * coeff * 4;

    return {
      proteinKcal: pKcal,
      fatKcal: fKcal,
      carbsKcal: cKcal,
      totalKcal: pKcal + fKcal + cKcal,
    };
  }, [weightG, proteinG, fatG, carbsG]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: name.trim(),
      weightG: weightG === "" ? undefined : Number(weightG),
      proteinG: proteinG === "" ? undefined : Number(proteinG),
      fatG: fatG === "" ? undefined : Number(fatG),
      carbsG: carbsG === "" ? undefined : Number(carbsG),
    });
  };

  return (
    <div className="food-modal-backdrop">
      <div className="food-modal">
        <div className="food-modal-header">
          <button className="food-modal-back-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
              <path
                d="M32 15H3.41l8.29-8.29-1.41-1.42-10 10a1 1 0 0 0 0 1.41l10 10 1.41-1.41L3.41 17H32z"
                data-name="4-Arrow Left"
                fill="var(--muted)"
              />
            </svg>
          </button>
        </div>

        <div className="food-modal-body">
          <div className="food-macro-card">
            <div className="food-title-box">
              <input
                className="food-name-input"
                placeholder="Food name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="food-macro-chart">
              <MacronutrientsCircle
                protein={proteinKcal}
                fat={fatKcal}
                carbs={carbsKcal}
                proteinG={Number(proteinG || 0)}
                fatG={Number(fatG || 0)}
                carbsG={Number(carbsG || 0)}
              />
            </div>
          </div>

          <div className="food-fields-card">
            <div className="food-field-row">
              <span className="food-field-label">Weight (g)</span>
              <div className="food-field-input-wrap">
                <input
                  type="number"
                  className="food-field-input"
                  value={weightG}
                  onChange={(e) => setWeightG(e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="food-field-row">
              <span className="food-field-label">Protein (g)</span>
              <div className="food-field-input-wrap">
                <input
                  type="number"
                  className="food-field-input"
                  value={proteinG}
                  onChange={(e) => setProteinG(e.target.value)}
                />
              </div>
            </div>

            <div className="food-field-row">
              <span className="food-field-label">Fat (g)</span>
              <div className="food-field-input-wrap">
                <input
                  type="number"
                  className="food-field-input"
                  value={fatG}
                  onChange={(e) => setFatG(e.target.value)}
                />
              </div>
            </div>

            <div className="food-field-row">
              <span className="food-field-label">Carbs (g)</span>
              <div className="food-field-input-wrap">
                <input
                  type="number"
                  className="food-field-input"
                  value={carbsG}
                  onChange={(e) => setCarbsG(e.target.value)}
                />
              </div>
            </div>

            <div className="food-field-row">
              <span className="food-field-label">Calories</span>
              <div className="food-field-input-wrap">
                <span className="food-field-static">
                  {Math.round(totalKcal)} kcal / 100 g
                </span>
              </div>
            </div>
          </div>

          <button className="food-save-btn" onClick={handleSubmit}>
            {isEdit ? "Save changes" : "Save food"}
          </button>
        </div>
      </div>
    </div>
  );

}
