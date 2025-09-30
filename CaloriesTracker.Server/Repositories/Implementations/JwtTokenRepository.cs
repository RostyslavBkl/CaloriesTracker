using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace CaloriesTracker.Server.Repositories
{
    public class JwtTokenRepository
    {
        private readonly string key;
        private readonly int accessMinutes;

        public JwtTokenRepository(IConfiguration configuration)
        {
            var key = configuration["Jwt:SecureKey"];
            if (string.IsNullOrWhiteSpace(key))
                throw new InvalidOperationException("JWT key is missing (Jwt:Key or Jwt:SecureKey)");

            this.key = key;

            var minutesRaw = configuration["Jwt:AccessTokenMinutes"];
            this.accessMinutes = int.TryParse(minutesRaw, out var mins) && mins > 0 ? mins : 60;
        }

        public string Generate(Guid userId)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);
            var header = new JwtHeader(credentials);

            var payload = new JwtPayload(userId.ToString(), audience: null, claims: null, notBefore: null, expires: DateTime.Today.AddDays(10));
            var securityToken = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }

        public JwtSecurityToken EncodeAndVerify(string jwt)
        {
            var handler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.key));

            handler.ValidateToken(jwt, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(1)
            }, out var validated);

            return (JwtSecurityToken)validated;
        }

        public static Guid GetUserId(JwtSecurityToken token)
        {
            var sub = token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value
                      ?? token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(sub, out var id))
                throw new InvalidOperationException("User id claim (sub) is missing or invalid");

            return id;
        }
    }
}
