using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CaloriesTracker.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnectionFactory connectionFactory;

        public UserRepository(IDbConnectionFactory connectionFactory)
        {
            this.connectionFactory = connectionFactory;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            using var connection = connectionFactory.Create();
            const string sql = @"
                SELECT Id, PasswordHash
                FROM Users
                WHERE Email = @Email;";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.NVarChar, 256) { Value = email });

            await connection.OpenAsync().ConfigureAwait(false);
            using var reader = await cmd.ExecuteReaderAsync(CommandBehavior.SingleRow).ConfigureAwait(false);
            if (!await reader.ReadAsync().ConfigureAwait(false))
                return null;

            var id = reader.GetOrdinal("Id");
            var hash = reader.GetOrdinal("PasswordHash");

            return new User
            {
                Id = reader.GetGuid(id),
                Email = email,
                PasswordHash = reader.GetString(hash)
            };
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            using var connection = connectionFactory.Create();
            const string sql = "SELECT 1 FROM Users WHERE Email = @Email;";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.NVarChar, 256) { Value = email });

            await connection.OpenAsync().ConfigureAwait(false);
            using var reader = await cmd.ExecuteReaderAsync(CommandBehavior.SingleRow).ConfigureAwait(false);
            return await reader.ReadAsync().ConfigureAwait(false);
        }


        public async Task<Guid> CreateUserAsync(User user)
        {
            using var connection = connectionFactory.Create();
            const string sql = @"
                INSERT INTO Users (Email, PasswordHash)
                OUTPUT INSERTED.Id
                VALUES (@Email, @PasswordHash);";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.NVarChar, 256) { Value = user.Email });
            cmd.Parameters.Add(new SqlParameter("@PasswordHash", SqlDbType.NVarChar, -1) { Value = user.PasswordHash });

            await connection.OpenAsync().ConfigureAwait(false);
            var insertedId = (Guid)await cmd.ExecuteScalarAsync().ConfigureAwait(false);
            return insertedId;
        }
        public async Task<User?> GetById(Guid id)
        {
            using var connection = connectionFactory.Create();
            const string sql = @"
            SELECT Id, Email
            FROM Users
            WHERE Id = @Id;";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier) { Value = id });

            await connection.OpenAsync().ConfigureAwait(false);
            using var reader = await cmd.ExecuteReaderAsync(CommandBehavior.SingleRow).ConfigureAwait(false);
            if (!await reader.ReadAsync().ConfigureAwait(false))
                return null;

            return new User
            {
                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                Email = reader.GetString(reader.GetOrdinal("Email"))
            };
        }
    }
}
