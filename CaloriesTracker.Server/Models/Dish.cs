namespace CaloriesTracker.Server.Models;

public class Dish
{
    public long Id { get; set; }
    public bool IsApi { get; set; }
    public long? UserId { get; set; }
    public string? Name { get; set; }
}
