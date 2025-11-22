using CaloriesTracker.Server.Models;

namespace CaloriesTracker.Server.Repositories.Interfaces
{
    public interface IUserProfileRepository
    {
        Task<User?> GetProfileAsync(Guid userId);
        Task<bool> UpdateDisplayNameAsync(Guid userId, string userName);
        Task<bool> UpdateBirthDateAsync(Guid userId, DateOnly? birthDate);
        Task<bool> UpdatePhysicalDataAsync(Guid userId, SexType sexType, decimal? heightCm, decimal? weightKg);
        Task<bool> UpdatePreferredUnitsAsync(Guid userId, HeightUnit heightUnit, WeightUnit weightUnit);
        Task<bool> PatchUserProfileAsync(UserProfilePatch patch);
    }
}
