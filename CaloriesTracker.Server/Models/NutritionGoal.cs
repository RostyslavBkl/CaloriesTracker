namespace CaloriesTracker.Server.Models;

public class NutritionGoal
{
    public Guid Id { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int TargetCalories { get; set; }
    public decimal? ProteinG { get; set; }
    public decimal? FatG { get; set; }
    public decimal? CarbG { get; set; }
    public Guid UserId { get; set; }
    public bool isActive { get; set; }
    //public bool IsActive =>
    //   StartDate <= DateTime.UtcNow.Date &&
    //   EndDate >= DateTime.UtcNow.Date;
}
