using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.AuthModels;

namespace CaloriesTracker.Server.Repositories
{
    public class AuthRepository
    {
        private readonly IUserRepository _users;
        private readonly JwtTokenRepository _jwt;

        public AuthRepository(IUserRepository users, JwtTokenRepository jwt)
        {
            _users = users;
            _jwt = jwt;
        }

        public async Task<AuthResponse> RegisterAsync(User user)
        {
            if (user == null)
                return new AuthResponse { Success = false, Message = "Invalid request" };

            if (await _users.EmailExistsAsync(user.Email))
                return new AuthResponse { Success = false, Message = "Email already exists" };

            await _users.CreateUserAsync(user);

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

            var user = await _users.GetByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return new AuthResponse { Success = false, Message = "Invalid data" };

            var token = _jwt.Generate(user.Id);
            return new AuthResponse
            {
                Success = true,
                Message = "Logged in",
                Token = token,
                User = new UserDto(user.Id, user.Email)
            };
        }
    }
}
