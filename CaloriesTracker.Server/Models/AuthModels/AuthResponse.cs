namespace CaloriesTracker.Server.Models.AuthModels
{
    public class AuthResponse
    {
        public bool Success { get; init; }
        public string? Message { get; init; }
        public string? Token { get; init; }
        public UserDto? User { get; init; }
    }
}