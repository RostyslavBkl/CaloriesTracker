using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.UserProfileTypes
{
    public class UserProfileType : ObjectGraphType<User>
    {
        public UserProfileType()
        {
            Field(x => x.Id, nullable: true);
            Field(x => x.UserName);
            Field(x => x.SexType);
            Field(x => x.BirthDate);
            Field(x => x.HeightCm);
            Field(x => x.WeightKg);
            Field(x => x.PreferredWeightUnit);
            Field(x => x.PreferredHeightUnit);
        }
    }
}