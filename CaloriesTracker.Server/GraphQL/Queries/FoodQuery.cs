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
                .Argument<GuidGraphType>("id")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<FoodService>();
                    var id = context.GetArgument<Guid>("id");
                    return await service.GetFoodByIdAsync(id);
                });
            Field<ListGraphType<FoodType>>("getListCustomFood")
               .ResolveAsync(async context =>
               {
                   var service = context.RequestServices!.GetRequiredService<FoodService>();
                   return await service.GetCustomFoodsAsync();
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
