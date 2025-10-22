namespace CaloriesTracker.Server.Models;

public class Meal
{
    public long Id { get; set; }
    public long DiaryDayId { get; set; }
    public MealType MealType { get; set; }
    public DateTimeOffset? EatenAt { get; set; }
}
