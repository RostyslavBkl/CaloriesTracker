namespace CaloriesTracker.Server.Models.Meal
{
    public class MealItem
    {
        public Guid Id { get; set; }
        public Guid MealId { get; set; }
        public Guid? DishId { get; set; }
        public Guid? FoodId { get; set; }
        public decimal? WeightG { get; set; }
    }
}
