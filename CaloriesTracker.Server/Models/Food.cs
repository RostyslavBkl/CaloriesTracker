using System.ComponentModel.DataAnnotations;

namespace CaloriesTracker.Server.Models;

public class Food
{
    public long Id { get; set; }
    public long? UserId { get; set; }
    public Type Type { get; set; } // add Enum FoodType(api/custom)

    [Required(ErrorMessage = "Name of Product is reqired")]
    public string Name { get; set; }
    public decimal? WeightG { get; set; }
    public decimal? ProteinG { get; set; }
    public decimal? FatG { get; set; }
    public decimal? CarbsG { get; set; }
}
