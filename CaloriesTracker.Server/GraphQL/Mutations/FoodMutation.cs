using CaloriesTracker.Server.GraphQL.Type;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Services.FoodService;
using GraphQL;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Mutations
{
    public class FoodMutation : ObjectGraphType
    {
        public FoodMutation()
        {
            Field<FoodType>("createCustomFood")
                .Argument<NonNullGraphType<FoodInputType>>("food")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<FoodService>();
                    var food = context.GetArgument<Food>("food");

                    return await service.CreateCustomFoodAsync(food);
                });
            Field<FoodType>("deleteCustomFood")
                .Argument<NonNullGraphType<GuidGraphType>>("id")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<FoodService>();
                    var id = context.GetArgument<Guid>("id");
                    return await service.DeleteCustomFoodAsync(id);
                });
            Field<FoodType>("updateCustomFood")
               .Argument<NonNullGraphType<GuidGraphType>>("id")
               .Argument<NonNullGraphType<FoodInputType>>("food")
               .ResolveAsync(async context =>
               {
                   var service = context.RequestServices!.GetRequiredService<FoodService>();
                   var food = context.GetArgument<Food>("food");
                   var id = context.GetArgument<Guid>("id");

                   food.Id = id;

                   return await service.UpdateCustomFoodAsync(food);
               });


            Field<FoodType>("addApiFood")
               .Argument<NonNullGraphType<FoodApiInputType>>("food")
               .ResolveAsync(async context =>
               {
                   var service = context.RequestServices!.GetRequiredService<FoodApiService>();
                   var food = context.GetArgument<Food>("food");
   
                   return await service.GetOrCreateFoodApiAsync(food);
               });
        }
    }
}
