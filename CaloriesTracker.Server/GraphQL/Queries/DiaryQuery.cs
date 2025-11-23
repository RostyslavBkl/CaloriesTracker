using CaloriesTracker.Server.GraphQL.Types.DiaryDay;
using CaloriesTracker.Server.Models.Diary;
using CaloriesTracker.Server.Services.DiaryDayServices;
using CaloriesTracker.Server.Services.FoodService;
using GraphQL;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Queries
{
    public class DiaryQuery : ObjectGraphType
    {
        public DiaryQuery()
        {
            Field<DiaryDetailsType>("getRecordByDate")
                .Argument<NonNullGraphType<DateGraphType>>("date")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<DiaryDayService>();
                    var date = context.GetArgument<DateTime>("date");
                    return await service.GetRecordByDate(date);
                });
        }
    }
}
