using CaloriesTracker.Server.Models;
using GraphQL.Types;

public class UserWeight : EnumerationGraphType<WeightUnit>
{
    public UserWeight()
    {
        Name = "UserWeight";
        Description = "Units of weight";
    }
}
