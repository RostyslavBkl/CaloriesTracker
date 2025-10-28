//using System.Data;
//using Microsoft.Data.SqlClient;
//using Microsoft.Extensions.Logging;
//using CaloriesTracker.Server.DataBase;
//using CaloriesTracker.Server.Models;

//namespace CaloriesTracker.Server.Repositories.Interfaces;

//public interface IUsersRepository
//{
//    Task<User?> GetByIdAsync(long id, CancellationToken ct);
//    Task<long> CreateAsync(User user, CancellationToken ct);
//}

//public class UsersRepository : IUsersRepository
//{
//    public Task<User?> GetByIdAsync(long id, CancellationToken ct)
//    {
//        // повертає null
//        return Task.FromResult<User?>(null);
//    }

//    public Task<long> CreateAsync(User user, CancellationToken ct)
//    {
//        // фейковий Id
//        return Task.FromResult(1L);
//    }
//}