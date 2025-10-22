using CaloriesTracker.Server.Models.AuthModels;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types
{
    public class RegInputType : InputObjectGraphType
    {
        public RegInputType()
        {
            Name = "RegInput";
            Field<NonNullGraphType<StringGraphType>>("email");
            Field<NonNullGraphType<StringGraphType>>("password");
        }
    }
}
