using CaloriesTracker.Server.GraphQL.Type;
using CaloriesTracker.Server.Models.AuthModels;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types
{
    public class AuthResponseType : ObjectGraphType<AuthResponse>
    {
        public AuthResponseType()
        {
            Name = "response";
            Field<NonNullGraphType<BooleanGraphType>>("success");
            Field<StringGraphType>("message");
            Field<StringGraphType>("token");
            Field<UserType>("user");

        }
    }
}
