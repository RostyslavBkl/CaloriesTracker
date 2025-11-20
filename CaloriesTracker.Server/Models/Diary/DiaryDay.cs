namespace CaloriesTracker.Server.Models.Diary;

public class DiaryDay
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }
    public Guid NutritionGoalId { get; set; }
}