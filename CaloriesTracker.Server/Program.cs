using CaloriesTracker.Server.Data.Ado;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Implementations;
using CaloriesTracker.Server.Repositories.Interfaces;
using CaloriesTracker.Server.Services;
using Microsoft.Data.SqlClient;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/testCalcKcal-.txt", rollingInterval: RollingInterval.Hour)
    .CreateLogger();


var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddSingleton<IDbConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IFoodRepository, FoodRepository>();
builder.Services.AddScoped<FoodService>();
builder.Services.AddScoped<FoodValidator>();

var app = builder.Build();

// DONE: Test Create Custom Food
/*(var scope = app.Services.CreateScope())
{
    var foodService = scope.ServiceProvider.GetRequiredService<FoodService>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbTester>>();

    var tester = new DbTester(foodService, logger);

    var testFood = new Food
    {
        Name = "Falafel",
        WeightG = 240m,
        ProteinG = 16m,
        FatG = 3.4m,
        CarbsG = 3m
    };

    var userId = Guid.Parse("D29A5515-82DD-4FE3-BC9F-DA2DFF0800E7");

    await tester.TestCreateCustomFood(testFood, userId);
}*/

//DONE: Test GET Food By Id
using (var scope = app.Services.CreateScope())
{
    var foodService = scope.ServiceProvider.GetRequiredService<FoodService>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbTester>>();

    var tester = new DbTester(foodService, logger);




    var id = Guid.Parse("4CCDFB79-6590-4C3B-81E7-EEE3D013D5C7");
    var userId = Guid.Parse("D29A5515-82DD-4FE3-BC9F-DA2DFF0800E7");

    await tester.TestKcal(id, userId);
}

// WIP: Test GET Custom Food by UserId VALIDATION FOR USER
/*using (var scope = app.Services.CreateScope())
{
    var foodService = scope.ServiceProvider.GetRequiredService<FoodService>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbTester>>();

    var tester = new DbTester(foodService, logger);

    var userId = Guid.Parse("D29A5515-82DD-4FE3-BC9F-DA2DFF0800E8");

    await tester.TestGetCustomFoods(userId);
}*/

// DONE: Test UPDATE Custom Food 
/*using (var scope = app.Services.CreateScope())
{
    var foodService = scope.ServiceProvider.GetRequiredService<FoodService>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbTester>>();

    var tester = new DbTester(foodService, logger);
    var userId = Guid.Parse("D29A5515-82DD-4FE3-BC9F-DA2DFF0800E7");


    var testFood = new Food
    {
        Id = Guid.Parse("1E94B097-B577-4170-973E-66E358AC84A6"),
        UserId = userId,
        Type = CaloriesTracker.Server.Models.Type.custom,
        Name = "New Food",
        WeightG = 100m,
        ProteinG = 10m,
        FatG = 2.4m,
        CarbsG = 3m
    };

    await tester.TestUpdateCustomFood(testFood, userId);
}*/

// WIP: Test DELETING Custom Food 
/*using (var scope = app.Services.CreateScope())
{
    var foodService = scope.ServiceProvider.GetRequiredService<FoodService>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbTester>>();

    var tester = new DbTester(foodService, logger);

    var id = Guid.Parse("11EE0004-9DDB-47A2-A09F-8990291101F6");
    var userId = Guid.Parse("D29A5515-82DD-4FE3-BC9F-DA2DFF0800E7");


    await tester.TestDeleteCustomFood(id, userId);
}*/


//app.MapGet("/health/db", async (IDbConnectionFactory factory, CancellationToken ct) =>
//{
//    await using var conn = factory.Create();
//    await conn.OpenAsync(ct);

//    await using var cmd = new SqlCommand("SELECT 1", conn);
//    var result = await cmd.ExecuteScalarAsync(ct);
//    return Results.Ok(new { status = "ok", db = result });
//});

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
//app.Run();
