using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.AuthModels;
using CaloriesTracker.Server.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CaloriesTracker.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthRepository authRepository;
        private readonly IUserRepository userRepository;
        private readonly JwtTokenRepository jwtTokenRepository;

        public AuthController(AuthRepository authRepository, IUserRepository userRepository, JwtTokenRepository jwtTokenRepository)
        {
            this.authRepository = authRepository;
            this.userRepository = userRepository;
            this.jwtTokenRepository = jwtTokenRepository;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] Registration request)
        {

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            var resp = await authRepository.RegisterAsync(user).ConfigureAwait(false);
            if (!resp.Success)
                return Conflict(resp);

            var jwt = jwtTokenRepository.Generate(resp.User.Id);

            var cfg = HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var minutesRaw = cfg["Jwt:AccessTokenMinutes"];
            var minutes = int.TryParse(minutesRaw, out var m) && m > 0 ? m : 60;

            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(minutes)
            });

            var result = new AuthResponse
            {
                Success = resp.Success,
                Message = resp.Message,
                User = resp.User,
                Token = jwt
            };

            return Ok(resp);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] Login request)
        {

            var resp = await authRepository.LoginAsync(request).ConfigureAwait(false);
            if (!resp.Success)
                return Unauthorized(resp);

            var jwt = jwtTokenRepository.Generate(resp.User.Id);

            var cfg = HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var minutesText = cfg["Jwt:AccessTokenMinutes"];
            var minutes = int.TryParse(minutesText, out var m) && m > 0 ? m : 60;

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddMinutes(minutes)
            };

            Response.Cookies.Append("jwt", jwt, cookieOptions);

            var result = new AuthResponse
            { 
                Success = resp.Success,
                Message = resp.Message, 
                User = resp.User,
                Token = jwt 
            };
            return Ok(resp);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var jwt = Request.Cookies["jwt"];

            if (jwt == null)
                return NotFound();

            var token = jwtTokenRepository.EncodeAndVerify(jwt);

            if (!Guid.TryParse(token.Issuer, out var userId)) 
                return NotFound();

            var user = await userRepository.GetById(userId).ConfigureAwait(false);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out" });
        }
    }
}
