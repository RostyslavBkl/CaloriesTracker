namespace CaloriesTracker.Server.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string? UserName { get; set; }
    public SexType SexType { get; set; }
    public DateOnly? BirthDate { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }
    public string? PreferredHeightUnit { get; set; }
    public string? PreferredWeightUnit { get; set; }

}

public sealed class UserProfilePatch
{
    public Guid UserId { get; init; }
    public bool SexSpecified { get; init; }
    public SexType? SexType { get; init; }
    public bool HeightSpecified { get; init; }
    public decimal? HeightCm { get; init; }
    public bool WeightSpecified { get; init; }
    public decimal? WeightKg { get; init; }
    public bool PreferredHeightUnitSpecified { get; init; }
    public string? PreferredHeightUnit { get; init; }
    public bool PreferredWeightUnitSpecified { get; init; }
    public string? PreferredWeightUnit { get; init; }
}


