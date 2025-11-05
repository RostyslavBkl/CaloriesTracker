namespace CaloriesTracker.Server.Models.Meal;

public class MealItem
{
    public long Id { get; set; }
    public long MealId { get; set; }
    public long? DishId { get; set; }
    public long? FoodId { get; set; }
    public decimal? WeightG { get; set; }
}
