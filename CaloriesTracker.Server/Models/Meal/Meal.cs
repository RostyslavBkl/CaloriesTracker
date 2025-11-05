namespace CaloriesTracker.Server.Models.Meal;

public class Meal
{
    public long Id { get; set; }
    public long DiaryDayId { get; set; }
    public MealType MealType { get; set; }
    public DateTimeOffset? EatenAt { get; set; }
    public List<MealItem> Items { get; set; }

}
