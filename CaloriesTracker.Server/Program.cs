using CaloriesTracker.Server.Data.Ado;
using CaloriesTracker.Server.GraphQL;
using CaloriesTracker.Server.GraphQL.Mutations;
using CaloriesTracker.Server.GraphQL.Queries;
using CaloriesTracker.Server.GraphQL.Schemas;
using CaloriesTracker.Server.GraphQL.Type;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Implementations;
using CaloriesTracker.Server.Repositories.Interfaces;
using CaloriesTracker.Server.Services;
using CaloriesTracker.Server.Services.FoodService;
using GraphQL;
using GraphQL.Server.Ui.GraphiQL;
using GraphQL.Server.Ui.Playground;
using GraphQL.Types;
using Microsoft.AspNetCore.Builder;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File($"logs/testGetOrCreate-.txt", rollingInterval: RollingInterval.Minute)
    .CreateLogger();

using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CaloriesTracker.Server.GraphQL;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();
builder.Services.Configure<FatSecretConfig>(builder.Configuration.GetSection("FatSecret"));
builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(o =>
    {
        o.RequireHttpsMetadata = true;
        o.SaveToken = true;

builder.Services.AddSingleton<IDbConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IFoodRepository, FoodRepository>();
builder.Services.AddScoped<IFoodApiRepository, FoodApiRepository>();
builder.Services.AddScoped<FoodService>();
builder.Services.AddScoped<FoodValidator>();
builder.Services.AddScoped<FoodApiService>();

// Reg GraphQL
builder.Services.AddSingleton<FoodQuery>();
builder.Services.AddSingleton<FoodMutation>();
// Types
builder.Services.AddSingleton<FoodType>();
builder.Services.AddSingleton<FoodInputType>();
builder.Services.AddSingleton<FoodApiInputType>();
builder.Services.AddSingleton<ISchema, FoodSchema>();

builder.Services.AddGraphQL(b => b
    .AddSchema<FoodSchema>()
    .AddSystemTextJson());
        var jwt = builder.Configuration.GetSection("Jwt");
        var jwtKey = jwt["SecureKey"] ?? throw new InvalidOperationException("Jwt:SecureKey missing");
        var jwtIssuer = jwt["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer missing");
        var jwtAudience = jwt["Audience"] ?? throw new InvalidOperationException("Jwt:Audience missing");


var app = builder.Build();
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

app.UseGraphQL<ISchema>("/graphql");

app.UseGraphQLGraphiQL("/ui/graphiql", new GraphiQLOptions
{
    GraphQLEndPoint = "/graphql"
});


//app.MapGet("/health/db", async (IDbConnectionFactory factory, CancellationToken ct) =>
//{
//    await using var conn = factory.Create();
//    await conn.OpenAsync(ct);

//    await using var cmd = new SqlCommand("SELECT 1", conn);
//    var result = await cmd.ExecuteScalarAsync(ct);
//    return Results.Ok(new { status = "ok", db = result });
//});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IDbConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthRepository>();
builder.Services.AddScoped<JwtTokenRepository>();

builder.Services.AddScoped<IPasswordHasher<CaloriesTracker.Server.Models.User>, PasswordHasher<CaloriesTracker.Server.Models.User>>();

builder.Services.AddScoped<AuthQuery>();
builder.Services.AddScoped<AuthMutation>();

builder.Services.AddControllers();
builder.Services.AddAuthorization();

builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    //.AddHttpRequestInterceptor<JwtHttpRequestInterceptor>()
    .AddQueryType<AuthQuery>()
    .AddMutationType<AuthMutation>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.UseWebSockets();
app.MapControllers();
app.MapGraphQL();

app.Run();
