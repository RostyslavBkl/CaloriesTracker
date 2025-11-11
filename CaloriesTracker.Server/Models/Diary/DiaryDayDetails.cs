using CaloriesTracker.Server.Models.Nutrition;
using CaloriesTracker.Server.Models.Meal;

namespace CaloriesTracker.Server.Models.Diary
{
    public class DiaryDayDetails
    {
        // diary
        public Guid DiaryDayId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }

        //goals
        public NutritionGoalSummary nutritionGoalSummary { get; set; }
        public List<Meal.Meal> Meals { get; set; }
        /*public Guid NutritionGoalId { get; set; }
        public int TargetCalories { get; set; }
        public decimal? ProteinG { get; set; }
        public decimal? FatG { get; set; }
        public decimal? CarbG { get; set; }*/
    }
}
