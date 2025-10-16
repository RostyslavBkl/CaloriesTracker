using CaloriesTracker.Server.GraphQL.Type;
using CaloriesTracker.Server.Services.FoodService;
using GraphQL;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Queries
{
    public class FoodQuery : ObjectGraphType
    {
        public FoodQuery()
        {
            Field<FoodType>("food")
                .Argument<IdGraphType>("id")
                .Argument<GuidGraphType>("userId")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<FoodService>();
                    var id = context.GetArgument<Guid>("id");
                    var userId = context.GetArgument<Guid>("userId");
                    return await service.GetFoodByIdAsync(id, userId);
                });
        }
    }
}
