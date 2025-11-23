using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.UserProfileTypes
{
    public class UserProfileType : ObjectGraphType<User>
    {
        public UserProfileType()
        {
            Field(x => x.Id);
            Field(x => x.UserName, nullable: true);
            Field(x => x.SexType, nullable: true);
            Field(x => x.BirthDate, nullable: true);
            Field(x => x.HeightCm, nullable: true);
            Field(x => x.WeightKg, nullable: true);
            Field(x => x.PreferredWeightUnit, nullable: true);
            Field(x => x.PreferredHeightUnit, nullable: true);
        }
    }
}