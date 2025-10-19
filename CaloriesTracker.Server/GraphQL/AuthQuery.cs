using CaloriesTracker.Server.Repositories;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CaloriesTracker.Server.GraphQL;

public class AuthQuery
{
    [AllowAnonymous]
    public async Task<Models.User?> Me(
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IUserRepository userRepository)
    {
        if (httpContextAccessor.HttpContext == null)
            return null;

        var idClaim = httpContextAccessor.HttpContext.User.FindFirst(c =>
            c.Type == "sub" ||
            c.Type == ClaimTypes.NameIdentifier ||
            c.Type == "nameid" ||
            c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

        if (idClaim is null || !Guid.TryParse(idClaim.Value, out var userId))
            return null;

        return await userRepository.GetById(userId);
    }
}
