using CaloriesTracker.Server.GraphQL.Types.MealTypes;
using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Models.Meal;
using CaloriesTracker.Server.Services;
using GraphQL;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Mutations
{
    public sealed class MealMutation : ObjectGraphType
    {
        public MealMutation()
        {
            Field<GuidGraphType>("createMealWithItems")
                .Argument<NonNullGraphType<CreateMealInputType>>("input")
                .ResolveAsync(async ctx =>
                {
                    try
                    {
                        var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                        var input = ctx.GetArgument<CreateMealDto>("input");

                        var meal = new Meal
                        {
                            DiaryDayId = input.DiaryDayId,
                            MealType = input.MealType,
                            EatenAt = input.EatenAt
                        };

                        var items = (input.Items ?? new List<MealItemDto>())
                            .Select(i => new MealItem
                            {
                                DishId = i.DishId,
                                FoodId = i.FoodId,
                                WeightG = i.WeightG
                            })
                            .ToList();

                        var id = await mealService.CreateMealWithItemsAsync(meal, items);
                        return id;
                    }
                    catch (Exception ex)
                    {
                        throw new ExecutionError("Failed to create meal", ex);
                    }
                });

            Field<BooleanGraphType>("deleteMeal")
                .Argument<NonNullGraphType<GuidGraphType>>("mealId")
                .ResolveAsync(async ctx =>
                {
                    try
                    {
                        var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                        var id = ctx.GetArgument<Guid>("mealId");
                        return await mealService.DeleteMealAsync(id);
                    }
                    catch (Exception ex)
                    {
                        throw new ExecutionError("Failed to delete meal", ex);
                    }
                });

            Field<BooleanGraphType>("updateMealItem")
                .Argument<NonNullGraphType<UpdateMealItemInput>>("input")
                .ResolveAsync(async ctx =>
                {
                    try
                    {
                        var mealService = ctx.RequestServices!.GetRequiredService<MealService>();
                        var input = ctx.GetArgument<UpdateMealItemDto>("input");

                        Console.WriteLine($"UpdateMealItem: itemId={input.ItemId}, dishId={input.DishId}, foodId={input.FoodId}, weightG={input.WeightG}");

                        var result = await mealService.UpdateMealItemAsync(
                            input.ItemId,
                            input.DishId,
                            input.FoodId,
                            input.WeightG);

                        Console.WriteLine($"UpdateMealItem result: {result}");
                        return result;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"UpdateMealItem exception: {ex}");
                        throw new ExecutionError("Failed to update meal item", ex);
                    }
                });
        }

        private record CreateMealDto(
            Guid DiaryDayId,
            MealType MealType,
            DateTimeOffset? EatenAt,
            List<MealItemDto>? Items);

        private record MealItemDto(Guid? DishId, Guid? FoodId, decimal? WeightG);

        private record UpdateMealItemDto(Guid ItemId, Guid? DishId, Guid? FoodId, decimal? WeightG);
    }
}
