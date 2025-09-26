using CaloriesTracker.Server.Data.Ado;
using CaloriesTracker.Server.Repositories.Implementations;
using CaloriesTracker.Server.Repositories.Interfaces;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddSingleton<IDbConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IFoodRepository, FoodRepository>();

var app = builder.Build();

app.MapGet("/health/db", async (IDbConnectionFactory factory, CancellationToken ct) =>
{
    await using var conn = factory.Create();
    await conn.OpenAsync(ct);

    await using var cmd = new SqlCommand("SELECT 1", conn);
    var result = await cmd.ExecuteScalarAsync(ct);
    return Results.Ok(new { status = "ok", db = result });
});

app.UseDefaultFiles();
app.MapStaticAssets();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();
