using CaloriesTracker.Server.GraphQL.Types.UserProfileTypes;
using CaloriesTracker.Server.Repositories;
using CaloriesTracker.Server.Repositories.Interfaces;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Queries
{
    public class UserProfileQuery : ObjectGraphType
    {
        public UserProfileQuery()
        {
            Field<UserProfileType>("myProfile")
                .ResolveAsync(async context =>
                {
                    var httpContextAccessor = context.RequestServices!.GetRequiredService<IHttpContextAccessor>();
                    var userProfileRepository = context.RequestServices!.GetRequiredService<IUserProfileRepository>();
                    var jwtService = context.RequestServices!.GetRequiredService<JwtTokenRepository>();

                    var httpContext = httpContextAccessor.HttpContext;
                    if (httpContext is null)
                        return null;

                    var jwt = httpContext.Request.Cookies["jwt"];
                    if (string.IsNullOrEmpty(jwt))
                        return null;

                    var token = jwtService.EncodeAndVerify(jwt);

                    if (!Guid.TryParse(token.Issuer, out var userId))
                        return null;

                    var user = await userProfileRepository
                        .GetProfileAsync(userId)
                        .ConfigureAwait(false);

                    return user;
                });
        }
    }
}
