namespace CaloriesTracker.Server.Models;

public class Food
{
    public long Id { get; set; }
    public long? UserId { get; set; }
    public string Type { get; set; } // add Enum FoodType(api/custom)
    public string? Name { get; set; }
    public decimal? WeightG { get; set; }
    public decimal? ProteinG { get; set; }
    public decimal? FatG { get; set; }
    public decimal? CarbsG { get; set; }
}
