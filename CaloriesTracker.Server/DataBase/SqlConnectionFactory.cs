using Microsoft.Data.SqlClient;

namespace CaloriesTracker.Server.Data.Ado;

public interface IDbConnectionFactory
{
    SqlConnection Create();
}

public class SqlConnectionFactory(IConfiguration cfg) : IDbConnectionFactory
{
    public SqlConnection Create()
        => new SqlConnection(cfg.GetConnectionString("DefaultConnection"));
}