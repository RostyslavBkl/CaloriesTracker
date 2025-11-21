using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types.NutritionGoal
{
    public class PlanEnumType : EnumerationGraphType<Plan>
    {
        public PlanEnumType()
        {
            Name = "Plan";
            Description = "Nutrition plan type";
        }
    }
}
