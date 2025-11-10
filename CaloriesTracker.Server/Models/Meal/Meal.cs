namespace CaloriesTracker.Server.Models.Meal
{
    public class Meal
    {
        public Guid Id { get; set; }
        public Guid DiaryDayId { get; set; }
        public MealType MealType { get; set; }
        public DateTimeOffset? EatenAt { get; set; }
        public List<MealItem> Items { get; set; }
    }
}
