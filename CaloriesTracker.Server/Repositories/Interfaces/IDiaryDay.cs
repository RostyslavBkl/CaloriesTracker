using CaloriesTracker.Server.Models.Diary;

namespace CaloriesTracker.Server.Repositories.Interfaces
{
    public interface IDiaryDay
    {
        Task<DiaryDay> CreateRecord(DiaryDay day, Guid userId);
    }
}
