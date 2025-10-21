using Azure.Core;
using CaloriesTracker.Server.GraphQL.Types;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.AuthModels;
using CaloriesTracker.Server.Repositories;
using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;

namespace CaloriesTracker.Server.GraphQL.Mutations;

public class AuthMutation : ObjectGraphType
{
    public AuthMutation()
    {
        Field<AuthResponseType>("Registration")
            .Argument<NonNullGraphType<RegInputType>>("request")
            .ResolveAsync(async context =>
            {
                var authRepository = context.RequestServices!.GetRequiredService<AuthRepository>();
                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var jwtTokenRepository = context.RequestServices!.GetRequiredService<JwtTokenRepository>();
                var configuration = context.RequestServices!.GetRequiredService<IConfiguration>();
                var httpContextAccessor = context.RequestServices!.GetRequiredService<IHttpContextAccessor>();

                var request = context.GetArgument<Registration>("request");
                if (request == null)
                    return new AuthResponse { Success = false, Message = "Invalid request" };

                if (await userRepository.EmailExistsAsync(request.Email))
                    return new AuthResponse { Success = false, Message = "Email already exists" };

                if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
                    return new AuthResponse { Success = false, Message = "Password is too short" };

                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                    PreferredWeightUnit = "kg"
                };

                var resp = await authRepository.RegisterAsync(user).ConfigureAwait(false);
                if (!resp.Success)
                    return resp;

                var jwt = jwtTokenRepository.Generate(resp.User.Id);
                var minutesRaw = configuration["Jwt:AccessTokenMinutes"];
                var minutes = int.TryParse(minutesRaw, out var m) && m > 0 ? m : 60;

                httpContextAccessor.HttpContext!.Response.Cookies.Append("jwt", jwt, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(minutes),
                    IsEssential = true
                });

                return new AuthResponse
                {
                    Success = true,
                    Message = resp.Message,
                    User = resp.User,
                    Token = jwt
                };
            });
    }
}
/* class AuthMutation
{
    private readonly AuthRepository authRepository;
    private readonly JwtTokenRepository jwtTokenRepository;
    private readonly IConfiguration configuration;
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly IUserRepository userRepository;

    public AuthMutation(
        AuthRepository authRepository,
        JwtTokenRepository jwtTokenRepository,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration,
        IUserRepository userRepository)
    {
        this.authRepository = authRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.httpContextAccessor = httpContextAccessor;
        this.configuration = configuration;
        this.userRepository = userRepository;
    }

    [AllowAnonymous]
    public async Task<AuthResponse> Register(Registration request)
    {
        if (request == null)
            return new AuthResponse { Success = false, Message = "Invalid request" };

        if (await userRepository.EmailExistsAsync(request.Email))
            return new AuthResponse { Success = false, Message = "Email already exists" };

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            return new AuthResponse { Success = false, Message = "Password is too short" };

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        var resp = await authRepository.RegisterAsync(user).ConfigureAwait(false);
        if (!resp.Success)
            return resp;

        var jwt = jwtTokenRepository.Generate(resp.User.Id);
        var minutesRaw = configuration["Jwt:AccessTokenMinutes"];
        var minutes = int.TryParse(minutesRaw, out var m) && m > 0 ? m : 60;

        httpContextAccessor.HttpContext!.Response.Cookies.Append("jwt", jwt, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddMinutes(minutes),
            IsEssential = true
        });

        return new AuthResponse
        {
            Success = true,
            Message = resp.Message,
            User = resp.User,
            Token = jwt
        };
    }

    [AllowAnonymous]
    public async Task<AuthResponse> Login(Login request)
    {
        if (request == null)
            return new AuthResponse { Success = false, Message = "Invalid  request" };

        var resp = await authRepository.LoginAsync(request).ConfigureAwait(false);
        if (!resp.Success)
            return resp;

        var jwt = jwtTokenRepository.Generate(resp.User.Id);
        var minutesText = configuration["Jwt:AccessTokenMinutes"];
        var minutes = int.TryParse(minutesText, out var m) && m > 0 ? m : 60;

        httpContextAccessor.HttpContext!.Response.Cookies.Append("jwt", jwt, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddMinutes(minutes),
            IsEssential = true
        });

        return new AuthResponse
        {
            Success = true,
            Message = resp.Message,
            User = resp.User,
            Token = jwt
        };
    }

    [Authorize]
    public bool Logout()
    {
        httpContextAccessor.HttpContext!.Response.Cookies.Delete("jwt", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            IsEssential = true
        });
        return true;
    }
}*/
