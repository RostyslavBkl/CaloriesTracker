using CaloriesTracker.Server.GraphQL.Type;
using CaloriesTracker.Server.Models.AuthModels;
using CaloriesTracker.Server.Repositories;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Queries;

public class AuthQuery : ObjectGraphType
{
    public AuthQuery()
    {
        Field<UserType>("me")
            .ResolveAsync(async context =>
            {
                var httpContextAccessor = context.RequestServices!.GetRequiredService<IHttpContextAccessor>();
                var userRepository = context.RequestServices!.GetRequiredService<IUserRepository>();
                var jwtService = context.RequestServices!.GetRequiredService<JwtTokenRepository>();

                if (httpContextAccessor.HttpContext == null)
                    return null;

                var jwt = httpContextAccessor.HttpContext!.Request.Cookies["jwt"];
                if (jwt == null)
                    return null;

                var token = jwtService.EncodeAndVerify(jwt);

                if (!Guid.TryParse(token.Issuer, out var userId))
                    return null;

                var user = await userRepository.GetById(userId);
                if (user == null)
                    return null;

                return new UserDto(user.Id, user.Email);
            });
    }
}
