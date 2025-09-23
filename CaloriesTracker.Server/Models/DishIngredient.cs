namespace CaloriesTracker.Server.Models;

public class DishIngredient
{
    public long Id { get; set; }
    public long DishId { get; set; }
    public decimal WeightG { get; set; }
    public long? FoodId { get; set; }
}

