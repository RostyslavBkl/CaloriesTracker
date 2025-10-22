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
            Field<ListGraphType<FoodType>>("getListCustomFood")
               .Argument<NonNullGraphType<GuidGraphType>>("userId")
               .ResolveAsync(async context =>
               {
                   var service = context.RequestServices!.GetRequiredService<FoodService>();

                   var userId = context.GetArgument<Guid>("userId");
                   return await service.GetCustomFoodsAsync(userId);
               });
            Field<ListGraphType<FoodType>>("ListItems")
               .Argument<NonNullGraphType<StringGraphType>>("query")
               .ResolveAsync(async context =>
               {
                   var service = context.RequestServices!.GetRequiredService<FoodApiService>();

                   var query = context.GetArgument<String>("query");
                   return await service.SearchFoodInApiAsync(query);
               });
        }
    }
}
