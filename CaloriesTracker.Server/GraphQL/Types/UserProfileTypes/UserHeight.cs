using CaloriesTracker.Server.Models;
using GraphQL.Types;

public class UserHeight : EnumerationGraphType<HeightUnit>
{
    public UserHeight()
    {
        Name = "UserHeight";
        Description = "Units of height";
    }
}
