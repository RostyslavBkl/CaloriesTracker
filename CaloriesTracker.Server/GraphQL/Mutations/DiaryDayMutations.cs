using CaloriesTracker.Server.GraphQL.Types.DiaryDay;
using CaloriesTracker.Server.Models.Diary;
using CaloriesTracker.Server.Services.DiaryDayServices;
using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Mutations
{
    public class DiaryDayMutations : ObjectGraphType
    {
        public DiaryDayMutations()
        {
            Field<DiaryType>("createDiaryDay")
                .ResolveAsync(async context =>
                {
                    var service = context.RequestServices!.GetRequiredService<DiaryDayService>();
                    return await service.CreateRecord();
                });
        }
    }
}
