using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace ApiNotasSimples.Data.Context;
public class SqlServerContext
{

    private readonly string _connectionString;

    public SqlServerContext(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("SqlServerConnection");
    }
    public SqlConnection GetConnection()
    {
        return new SqlConnection(_connectionString);
    }
}



