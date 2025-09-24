namespace CaloriesTracker.Server.Models;

public class NutritionGoal
{
    public long Id { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int TargetCalories { get; set; }
    public decimal? ProteinG { get; set; }
    public decimal? FatG { get; set; }
    public decimal? CarbG { get; set; }
    public long UserId { get; set; }
}
