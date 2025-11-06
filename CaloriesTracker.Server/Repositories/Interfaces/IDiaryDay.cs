using CaloriesTracker.Server.Models.Diary;

namespace CaloriesTracker.Server.Repositories.Interfaces
{
    public interface IDiaryDay
    {
        Task<DiaryDay> CreateRecord(Guid userId);
        Task<DiaryDayDetails> GetRecordByDate(DateTime date, Guid userId);
    }
}
