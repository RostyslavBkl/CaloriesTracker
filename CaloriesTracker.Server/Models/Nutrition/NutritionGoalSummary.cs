namespace CaloriesTracker.Server.Models.Nutrition
{
    public class NutritionGoalSummary
    {
        public Guid NutritionGoalId { get; set; }
        public int TargetCalories { get; set; }
        public decimal ProteinG { get; set; }
        public decimal FatG { get; set; }
        public decimal CarbG { get; set; }
    }
}
