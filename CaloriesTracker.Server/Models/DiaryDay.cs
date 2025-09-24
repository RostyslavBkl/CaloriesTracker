namespace CaloriesTracker.Server.Models;

public class DiaryDay
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public DateOnly Date { get; set; }
    public long NutritionGoalId { get; set; }
}