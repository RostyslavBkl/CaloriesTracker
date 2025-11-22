using CaloriesTracker.Server.Models;
using GraphQL.Types;

public class UserSex : EnumerationGraphType<SexType>
{
    public UserSex()
    {
        Name = "UserSex";
        Description = "Users sex";
    }
}
