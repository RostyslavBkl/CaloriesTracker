using CaloriesTracker.Server.Models;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types
{
    public class SummaryNutritionType : ObjectGraphType<SummaryNutrition>
    {
        public SummaryNutritionType()
        {
            Name = "SummaryNutrition";

            Field<FloatGraphType>("proteinG", resolve: ctx => ctx.Source.ProteinG);
            Field<FloatGraphType>("fatG", resolve: ctx => ctx.Source.FatG);
            Field<FloatGraphType>("carbsG", resolve: ctx => ctx.Source.CarbsG);
            Field<FloatGraphType>("kcal", resolve: ctx => ctx.Source.Kcal);
        }
    }
}
