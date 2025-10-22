using CaloriesTracker.Server.DataBase;
using CaloriesTracker.Server.GraphQL.Mutations;
using CaloriesTracker.Server.GraphQL.Queries;
using CaloriesTracker.Server.GraphQL.Schemas;
using CaloriesTracker.Server.GraphQL.Type;
using CaloriesTracker.Server.GraphQL.Types;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories;
using CaloriesTracker.Server.Repositories.Implementations;
using CaloriesTracker.Server.Repositories.Interfaces;
using CaloriesTracker.Server.Services.FoodService;
using GraphQL;
using GraphQL.Server.Ui.GraphiQL;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;


Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File($"logs/testGetOrCreate-.txt", rollingInterval: RollingInterval.Minute)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

// JWT Configuration
var jwt = builder.Configuration.GetSection("Jwt");
var jwtKey = jwt["SecureKey"] ?? throw new InvalidOperationException("Jwt:SecureKey missing");
var jwtIssuer = jwt["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer missing");
var jwtAudience = jwt["Audience"] ?? throw new InvalidOperationException("Jwt:Audience missing");

// Controllers and API
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHttpClient();
builder.Services.AddHttpContextAccessor();

// Configuration
builder.Services.Configure<FatSecretConfig>(builder.Configuration.GetSection("FatSecret"));

// Authentication
builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(o =>
    {
        o.RequireHttpsMetadata = true;
        o.SaveToken = true;
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true
        };
    });



builder.Services.AddAuthorization();

// CORS - ????? ????? app.Build()
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("https://localhost:35431") // ???? Vite dev server
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Database and Repositories
builder.Services.AddSingleton<IDbConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFoodRepository, FoodRepository>();
builder.Services.AddScoped<IFoodApiRepository, FoodApiRepository>();

// Services
builder.Services.AddScoped<FoodService>();
builder.Services.AddScoped<FoodValidator>();
builder.Services.AddScoped<FoodApiService>();
builder.Services.AddScoped<AuthRepository>();
builder.Services.AddScoped<JwtTokenRepository>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// GraphQL Registration
builder.Services.AddSingleton<RootQuery>();
builder.Services.AddSingleton<FoodQuery>();
builder.Services.AddSingleton<AuthQuery>();


builder.Services.AddSingleton<RootMutations>();
builder.Services.AddSingleton<FoodMutation>();
builder.Services.AddSingleton<AuthMutation>();

// GraphQL Types
builder.Services.AddSingleton<FoodType>();
builder.Services.AddSingleton<FoodInputType>();
builder.Services.AddSingleton<FoodApiInputType>();
// Auth Types
builder.Services.AddSingleton<UserType>();
builder.Services.AddSingleton<AuthResponseType>();
builder.Services.AddSingleton<RegInputType>();
builder.Services.AddSingleton<LogInputType>();



// GraphQL Schema and Server (GraphQL-Core for Food)
builder.Services.AddSingleton<RootSchema>();
builder.Services.AddGraphQL(b => b
    .AddSchema<RootSchema>()
    .AddSystemTextJson());

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseWebSockets();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.UseGraphQL<RootSchema>("/graphql");

// GraphQL endpoints
app.UseGraphQLGraphiQL("/ui/graphiql", new GraphiQLOptions
{
    GraphQLEndPoint = "/graphql"
});

app.MapControllers();

app.Run();