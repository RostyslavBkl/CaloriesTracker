using CaloriesTracker.Server.Models.AuthModels;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Type
{
    public class UserType : ObjectGraphType<UserDto>
    {
        public UserType()
        {
            Name = "User";
            Field<NonNullGraphType<GuidGraphType>>("id");
            Field<NonNullGraphType<StringGraphType>>("email");
        }
    }
}
