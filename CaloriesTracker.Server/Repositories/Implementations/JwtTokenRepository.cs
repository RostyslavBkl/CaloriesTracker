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
        private readonly string issuer;
        private readonly string audience;

        public JwtTokenRepository(IConfiguration configuration)
        {
            this.key = configuration["Jwt:SecureKey"] ??
                throw new InvalidOperationException("Jwt key is missing (Jwt:SecureKey)");

            this.issuer = configuration["Jwt:Issuer"] ??
                throw new InvalidOperationException("Jwt issuer is missing");

            this.audience = configuration["Jwt:Audience"] ??
                throw new InvalidOperationException("Jwt audience is missing");

            var minutesRaw = configuration["Jwt:AccessTokenMinutes"];
            this.accessMinutes = int.TryParse(minutesRaw, out var mins) && mins > 0 ? mins : 60;
        }

        public string Generate(Guid userId)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: this.issuer,
                audience: this.audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(this.accessMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public JwtSecurityToken EncodeAndVerify(string jwt)
        {
            var handler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.key));

            handler.ValidateToken(jwt, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
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
