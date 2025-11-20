using CaloriesTracker.Server.Models.Diary;
using CaloriesTracker.Server.Repositories;
using CaloriesTracker.Server.Repositories.Interfaces;

namespace CaloriesTracker.Server.Services.DiaryDayServices
{
    public class DiaryDayService
    {
        private readonly IDiaryDay _diaryRepo;
        private readonly IHttpContextAccessor _http;
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenRepository _jwt;

        public DiaryDayService(IDiaryDay diaryRepo, IHttpContextAccessor http, IUserRepository userRepository, JwtTokenRepository jwt)
        {
            _diaryRepo = diaryRepo;
            _http = http;
            _userRepository = userRepository;
            _jwt = jwt;
        }

        public async Task<Guid> GetUserId()
        {
            if (_http.HttpContext == null)
                return Guid.Empty;

            var jwt = _http.HttpContext!.Request.Cookies["jwt"];
            if (jwt == null)
                return Guid.Empty;

            var token = _jwt.EncodeAndVerify(jwt);

            if (!Guid.TryParse(token.Issuer, out var userId))
                return Guid.Empty;

            var user = await _userRepository.GetById(userId);
            if (user == null)
                return Guid.Empty;

            return user.Id;
        }

        public async Task<DiaryDay> CreateRecord()
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");

            var diaryDay = await _diaryRepo.CreateRecord(userId);
            return diaryDay;
        }

        public async Task<DiaryDayDetails> GetRecordByDate(DateTime date)
        {
            var userId = await GetUserId();
            if (userId == Guid.Empty)
                throw new UnauthorizedAccessException("User not authenticated");

            var fullDay = await _diaryRepo.GetRecordByDate(date, userId);
            return fullDay;
        }
    }
}
