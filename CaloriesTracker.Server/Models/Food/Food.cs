using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CaloriesTracker.Server.Models;

public class Food
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public Type Type { get; set; }
    public string? ExternalId { get; set; }

    [Required(ErrorMessage = "Name of Product is reqired")]
    public string? Name { get; set; }
    public decimal? WeightG { get; set; }
    public decimal? ProteinG { get; set; }
    public decimal? FatG { get; set; }
    public decimal? CarbsG { get; set; }

    // Калорійність на 100гр
    [NotMapped]
    public decimal ActualWeightG { get; set; }

    [NotMapped]
    public decimal TotalKcal
    {
        get
        {
            var weight = WeightG ?? 100m;
            var weightCoff = ActualWeightG / weight;

            var protein = (ProteinG ?? 0) * weightCoff * 4;
            var fat = (FatG ?? 0) * weightCoff * 9;
            var carbs = (CarbsG ?? 0) * weightCoff * 4;

            return protein + fat + carbs; 
        }
    }

    [NotMapped]
    public decimal ActualProteinG => (ProteinG ?? 0) * ActualWeightG / (WeightG ?? 100m);
    [NotMapped]
    public decimal ActualFatG => (FatG ?? 0) * ActualWeightG / (WeightG ?? 100m);
    [NotMapped] 
    public decimal ActualCarbsG => (CarbsG ?? 0) * ActualWeightG / (WeightG ?? 100m);
}
