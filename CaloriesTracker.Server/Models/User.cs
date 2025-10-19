namespace CaloriesTracker.Server.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string? DisplayName { get; set; }
    public SexType SexType { get; set; }
    public DateOnly? BirthDate { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public string? PreferredHeightUnit { get; set; }
    public string? PreferredWeightUnit { get; set; }
}
