using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.AuthModels;

namespace CaloriesTracker.Server.Repositories
{
    public class AuthRepository
    {
        private readonly IUserRepository users;
        private readonly JwtTokenRepository jwt;

        public AuthRepository(IUserRepository users, JwtTokenRepository jwt)
        {
            this.users = users;
            this.jwt = jwt;
        }

        public async Task<AuthResponse> RegisterAsync(User user)
        {
            await users.CreateUserAsync(user);

            return new AuthResponse
            {
                Success = true,
                Message = "Registered",
                User = new UserDto(user.Id, user.Email)
            };
        }

        public async Task<AuthResponse> LoginAsync(Login request)
        {
            if (request == null)
                return new AuthResponse { Success = false, Message = "Invalid request" };

            var user = await users.GetByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return new AuthResponse { Success = false, Message = "Invalid data" };

            return new AuthResponse
            {
                Success = true,
                Message = "Logged in",
                User = new UserDto(user.Id, user.Email)
            };
        }
    }
}
