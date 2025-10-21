using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Type
{
    public class FoodType : ObjectGraphType<Food>
    {
        public FoodType()
        {
            Field(x => x.Id);
            Field(x => x.UserId, nullable: true);
            Field(x => x.Type);
            Field(x => x.ExternalId, nullable: true);
            Field(x => x.Name);
            Field(x => x.WeightG, nullable: true);
            Field(x => x.ProteinG, nullable: true);
            Field(x => x.FatG, nullable: true);
            Field(x => x.CarbsG, nullable: true);
        }
    }
}
