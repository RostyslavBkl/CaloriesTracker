using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.MealTypes;

public class MealTypeEnum : EnumerationGraphType<MealType>
{
    public MealTypeEnum()
    {
        Name = "MealType";
        Description = "Type of the meal.";
    }
}
