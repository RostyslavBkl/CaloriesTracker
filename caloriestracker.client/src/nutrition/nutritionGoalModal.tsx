import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  closeGoalModal,
  setGoalRequest,
  updateGoalRequest,
} from './nutritionGoalSlice';
import { Plan } from './nutritionGoalTypes';
import { useAppDispatch } from '../store/hooks';
import './NutritionGoalModal.css';

export const NutritionGoalModal = () => {
  const dispatch = useAppDispatch();

  const { isModalOpen, loading, error, activeGoal } = useSelector(
    (s: RootState) => s.nutritionGoal
  );

  const [plan, setPlan] = useState<Plan>('Balanced');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [proteinG, setProteinG] = useState(0);
  const [fatG, setFatG] = useState(0);
  const [carbG, setCarbG] = useState(0);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    if (activeGoal) {
      setTargetCalories(activeGoal.targetCalories);
      setProteinG(activeGoal.proteinG ?? 0);
      setFatG(activeGoal.fatG ?? 0);
      setCarbG(activeGoal.carbG ?? 0);
      setPlan('Balanced');
    } else {
      setTargetCalories(2000);
      setProteinG(0);
      setFatG(0);
      setCarbG(0);
      setPlan('Balanced');
    }
  }, [activeGoal, isModalOpen]);

  if (!isModalOpen) return null;

  const isEditing = !!activeGoal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (plan === 'Balanced') {
      if (isEditing) {
        dispatch(
          updateGoalRequest({
            plan: 'Balanced',
            targetCalories,
          })
        );
      } else {
        dispatch(
          setGoalRequest({
            plan: 'Balanced',
            targetCalories,
          })
        );
      }

      return;
    }

    if (isEditing) {
      dispatch(
        updateGoalRequest({
          plan: 'Custom',
          targetCalories,
          proteinG,
          fatG,
          carbG,
        })
      );
    } else {
      dispatch(
        setGoalRequest({
          plan: 'Custom',
          targetCalories,
          proteinG,
          fatG,
          carbG,
        })
      );
    }
  };

  const handleClose = () => {
    dispatch(closeGoalModal());
  };

  return (
    <div className="goal-modal-backdrop">
      <div className="goal-modal">
        <div className="goal-modal-header">
          <h2 className="goal-modal-title">Daily goal</h2>

          <button
            type="button"
            className="goal-modal-close"
            onClick={handleClose}
            aria-label="Close daily goal modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="goal-modal-body">
          <div className="plan-toggle">
            <button
              type="button"
              className={plan === 'Balanced' ? 'active' : ''}
              onClick={() => setPlan('Balanced')}
            >
              Balanced
            </button>
            <button
              type="button"
              className={plan === 'Custom' ? 'active' : ''}
              onClick={() => setPlan('Custom')}
            >
              Custom
            </button>
          </div>

          <div className="field">
            <label>Target calories (kcal)</label>
            <input
              type="number"
              min={1000}
              max={3500}
              value={targetCalories}
              onChange={e => setTargetCalories(Number(e.target.value))}
              required
            />
          </div>

          {plan === 'Custom' && (
            <>
              <div className="field">
                <label>Protein (g)</label>
                <input
                  type="number"
                  min={0}
                  value={proteinG}
                  onChange={e => setProteinG(Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label>Fat (g)</label>
                <input
                  type="number"
                  min={0}
                  value={fatG}
                  onChange={e => setFatG(Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label>Carbs (g)</label>
                <input
                  type="number"
                  min={0}
                  value={carbG}
                  onChange={e => setCarbG(Number(e.target.value))}
                />
              </div>
            </>
          )}

          {error && <div className="error goal-modal-error">{error}</div>}

          <div className="goal-modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="goal-modal-btn goal-modal-btn--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="goal-modal-btn goal-modal-btn--primary"
            >
              {loading ? 'Saving…' : isEditing ? 'Update goal' : 'Save goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
