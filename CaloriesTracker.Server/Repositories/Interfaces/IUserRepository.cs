using CaloriesTracker.Server.Models;

namespace CaloriesTracker.Server.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetById(Guid id);
        Task<bool> EmailExistsAsync(string email);
        Task<Guid> CreateUserAsync(User user);
    }
}
