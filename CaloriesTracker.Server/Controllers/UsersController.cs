using Microsoft.AspNetCore.Mvc;
using CaloriesTracker.Server.Repositories;
using CaloriesTracker.Server.Models;

namespace CaloriesTracker.Server.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(IUsersRepository repo) : ControllerBase
{
    [HttpGet("{id:long}")]
    public async Task<ActionResult<User>> GetById(long id, CancellationToken ct)
    {
        var user = await repo.GetByIdAsync(id, ct);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(User user, CancellationToken ct)
    {
        var id = await repo.CreateAsync(user, ct);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }
}
