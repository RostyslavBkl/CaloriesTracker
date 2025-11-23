using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;
using CaloriesTracker.Server.Services;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CaloriesTracker.Server.Repositories.Implementations
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly IDbConnectionFactory connectionFactory;
        public UserProfileRepository(IDbConnectionFactory connectionFactory)
        {
            this.connectionFactory = connectionFactory;
        }

        public async Task<User?> GetProfileAsync(Guid userId)
        {
            try
            {
                using var connection = connectionFactory.Create();
                const string sql = @"
                    SELECT Id, Email
                    FROM Users
                    WHERE Id = @Id;";

                using var cmd = new SqlCommand(sql, connection);
                cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier) { Value = userId });

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
            catch (SqlException)
            {
                throw;
            }
        }

        public async Task<bool> UpdateDisplayNameAsync(Guid userId, string userName)
        {
            using var connection = connectionFactory.Create();
            const string sql = @"
                UPDATE Users SET UserName = @DisplayName 
                WHERE Id = @Id";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier) { Value = userId });
            cmd.Parameters.Add(new SqlParameter("@DisplayName", SqlDbType.NVarChar, 255) { Value = userName });

            await connection.OpenAsync().ConfigureAwait(false);
            var rowsAffected = await cmd.ExecuteNonQueryAsync().ConfigureAwait(false);

            return rowsAffected > 0;
        }

        public async Task<bool> UpdateBirthDateAsync(Guid userId, DateOnly? birthDate)
        {
            using var connection = connectionFactory.Create();
            const string sql = @"
                UPDATE Users 
                SET BirthDate = @birthDate 
                WHERE Id = @Id;";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier) { Value = userId });

            var birthDateParam = new SqlParameter("@birthDate", SqlDbType.Date)
            {
                Value = birthDate.HasValue
                    ? birthDate.Value.ToDateTime(TimeOnly.MinValue) : DBNull.Value
            };
            cmd.Parameters.Add(birthDateParam);

            await connection.OpenAsync().ConfigureAwait(false);
            var rowsAffected = await cmd.ExecuteNonQueryAsync().ConfigureAwait(false);

            return rowsAffected > 0;
        }

        public async Task<bool> UpdatePhysicalDataAsync(Guid userId, SexType sexType, decimal? heightCm, decimal? weightKg)
        {
            using var connection = connectionFactory.Create();
            const string sql = @"
                UPDATE Users 
                SET Sex = @sexType, HeightCm = @heightCm, WeightKg = @weightKg
                WHERE Id = @Id;";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier) { Value = userId });
            cmd.Parameters.Add(new SqlParameter("@sexType", SqlDbType.NVarChar, 16) { Value = UserProfileService.MapSexTypeToDb(sexType) });

            var precisionHeight = new SqlParameter("@heightCm", SqlDbType.Decimal)
            {
                Precision = 5,
                Scale = 2,
                Value = heightCm.HasValue ? heightCm.Value : (object)DBNull.Value
            };
            cmd.Parameters.Add(precisionHeight);

            var precisionWeight = new SqlParameter("@weightKg", SqlDbType.Decimal)
            {
                Precision = 6,
                Scale = 3,
                Value = weightKg.HasValue ? weightKg.Value : (object)DBNull.Value
            };
            cmd.Parameters.Add(precisionWeight);

            await connection.OpenAsync().ConfigureAwait(false);
            var rowsAffected = await cmd.ExecuteNonQueryAsync().ConfigureAwait(false);

            return rowsAffected > 0;
        }

        public async Task<bool> UpdatePreferredUnitsAsync(Guid userId, HeightUnit heightUnit, WeightUnit weightUnit)
        {
            using var connection = connectionFactory.Create();
            const string sql = @"
                UPDATE Users 
                SET PreferredHeightUnit = @heightUnit, PreferredWeightUnit = @weightUnit
                WHERE Id = @Id;";

            using var cmd = new SqlCommand(sql, connection);
            cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier) { Value = userId });
            cmd.Parameters.Add(new SqlParameter("@heightUnit", SqlDbType.NVarChar, 16) { Value = UserProfileService.MapHeightUnitToDb(heightUnit) });
            cmd.Parameters.Add(new SqlParameter("@weightUnit", SqlDbType.NVarChar, 16) { Value = UserProfileService.MapWeightUnitToDb(weightUnit) });

            await connection.OpenAsync().ConfigureAwait(false);
            var rowsAffected = await cmd.ExecuteNonQueryAsync().ConfigureAwait(false);

            return rowsAffected > 0;
        }

        public async Task<bool> PatchUserProfileAsync(UserProfilePatch patch)
        {
            using var connection = connectionFactory.Create();
            using var cmd = new SqlCommand { Connection = (SqlConnection)connection };

            var sets = new List<string>();

            if (patch.SexSpecified)
            {
                sets.Add("Sex = @Sex");
                cmd.Parameters.Add(new SqlParameter("@Sex", SqlDbType.NVarChar, 16)
                {
                    Value = patch.SexType is null ? DBNull.Value : UserProfileService.MapSexTypeToDb(patch.SexType.Value)
                });
            }

            if (patch.HeightSpecified)
            {
                sets.Add("HeightCm = @HeightCm");
                var p = new SqlParameter("@HeightCm", SqlDbType.Decimal) { Precision = 5, Scale = 2 };
                p.Value = patch.HeightCm is null ? DBNull.Value : patch.HeightCm;
                cmd.Parameters.Add(p);
            }

            if (patch.WeightSpecified)
            {
                sets.Add("WeightKg = @WeightKg");
                var p = new SqlParameter("@WeightKg", SqlDbType.Decimal) { Precision = 6, Scale = 3 };
                p.Value = patch.WeightKg is null ? DBNull.Value : patch.WeightKg;
                cmd.Parameters.Add(p);
            }

            if (patch.PreferredHeightUnitSpecified)
            {
                sets.Add("PreferredHeightUnit = @PHU");
                cmd.Parameters.Add(new SqlParameter("@PHU", SqlDbType.NVarChar, 16)
                {
                    Value = patch.PreferredHeightUnit is null ? DBNull.Value : patch.PreferredHeightUnit
                });
            }

            if (patch.PreferredWeightUnitSpecified)
            {
                sets.Add("PreferredWeightUnit = @PWU");
                cmd.Parameters.Add(new SqlParameter("@PWU", SqlDbType.NVarChar, 16)
                {
                    Value = patch.PreferredWeightUnit is null ? DBNull.Value : patch.PreferredWeightUnit
                });
            }

            if (sets.Count == 0)
                return false;

            cmd.Parameters.Add(new SqlParameter("@Id", SqlDbType.UniqueIdentifier) { Value = patch.UserId });
            cmd.CommandText = $@"
                UPDATE Users
                SET {string.Join(", ", sets)}
                WHERE Id = @Id;";

            await connection.OpenAsync().ConfigureAwait(false);
            var affected = await cmd.ExecuteNonQueryAsync().ConfigureAwait(false);
            return affected > 0;
        }
    }
}
