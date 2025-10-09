using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace CaloriesTracker.Server.Services.FoodService
{
    public class FoodApiService
    {
        private readonly string _consKey;
        private readonly string _consSecret;
        private readonly IFoodApiRepository _foodApiRepository;
        private readonly FoodValidator _foodValidator ;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<FoodApiService> _logger;

        public FoodApiService(IOptions<FatSecretConfig> cfg, IFoodApiRepository foodApiRepository, FoodValidator foodValidator, IHttpClientFactory httpClientFactory, ILogger<FoodApiService> logger)
        {
            _consKey = cfg.Value.ConsumerKey;
            _consSecret = cfg.Value.ConsumerSecret;
            _foodApiRepository = foodApiRepository;
            _foodValidator = foodValidator;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public async Task<string> FetchFoodDataFromApiAsync(string query)
        {
            var url = "https://platform.fatsecret.com/rest/server.api";
            var httpMethod = "GET";

            // параметри OAuth
            var allParams = new Dictionary<string, string>
            {
                {"method", "foods.search"},
                {"search_expression", query},
                {"format", "json"},
                {"oauth_consumer_key", _consKey},
                {"oauth_signature_method", "HMAC-SHA1"},
                {"oauth_timestamp", ((int)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalSeconds).ToString()},
                {"oauth_nonce", Guid.NewGuid().ToString("N")},
                {"oauth_version", "1.0"}
            };

            // підпис OAuth
            var sortedParams = allParams.OrderBy(kvp => kvp.Key).ThenBy(kvp => kvp.Value);
            var paramString = string.Join("&", sortedParams.Select(kvp =>
                $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value)}"));

            var signatureBaseString = string.Join("&",
                Uri.EscapeDataString(httpMethod),
                Uri.EscapeDataString(url),
                Uri.EscapeDataString(paramString));

            var signingKey = $"{Uri.EscapeDataString(_consSecret)}&";

            string signature;
            using (var hmac = new HMACSHA1(Encoding.ASCII.GetBytes(signingKey)))
            {
                var hash = hmac.ComputeHash(Encoding.ASCII.GetBytes(signatureBaseString));
                signature = Convert.ToBase64String(hash);
            }

            allParams["oauth_signature"] = signature;

            // URL з усіма параметрами
            var queryString = string.Join("&", allParams.OrderBy(kvp => kvp.Key)
                .Select(kvp => $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value)}"));

            var fullUrl = $"{url}?{queryString}";

            _logger.LogInformation("Request URL: {Url}", fullUrl);

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(fullUrl);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                _logger.LogError("API error: {Status} - {Error}", response.StatusCode, err);
                throw new Exception($"FatSecret API error: {response.StatusCode} - {err}");
            }

            return await response.Content.ReadAsStringAsync();
        }

        public async Task<List<Food>> SearchFoodInApiAsync(string query)
        {
            var json = await FetchFoodDataFromApiAsync(query);

            Console.WriteLine("=== RAW JSON ===");
            Console.WriteLine(json);
            Console.WriteLine("================");

            var res = JsonConvert.DeserializeObject<FoodResApi>(json);
            if (res?.Foods?.Food == null || !res.Foods.Food.Any())
            {
                return new List<Food>();
            }

            var results = new List<Food>();
            foreach (var apiFood in res.Foods.Food)
            {
                var food = new Food
                {
                    Name = apiFood.FoodName,
                    Type = Models.Type.api,
                    ExternalId = apiFood.FoodId,
                    WeightG = 100m,
                    ProteinG = ExtractNutrient(apiFood.FoodDescription, "Protein:"),
                    FatG = ExtractNutrient(apiFood.FoodDescription, "Fat:"),
                    CarbsG = ExtractNutrient(apiFood.FoodDescription, "Carbs:"),
                };
                results.Add(food);
            }
            return results;
        }

        public async Task<Food> GetOrCreateFoodApiAsync(Food selectedFood)
        {
            _foodValidator.ValidateFoodApi(selectedFood);

            var foodExists = await _foodApiRepository.GetFoodByExternalIdAsync(selectedFood.ExternalId);

            if (foodExists != null)
                return foodExists;

            selectedFood.Id = Guid.NewGuid();
            return await _foodApiRepository.AddApiFoodAsync(selectedFood);
        }

        private decimal? ExtractNutrient(string description, string keyword)
        {
            if (string.IsNullOrEmpty(description)) return null;

            try
            {
                var parts = description.Split('|');

                var part = parts.FirstOrDefault(p => p.Contains(keyword));
                if (part == null) return null;

                var colonSplit = part.Split(':');
                if (colonSplit.Length < 2) return null;

                var valueText = colonSplit[1].Trim();
                var numberPart = new string(valueText.TakeWhile(c => char.IsDigit(c) || c == '.').ToArray());

                return decimal.TryParse(numberPart, out var value) ? value : null;
            }
            catch
            {
                return null;
            }
        }
    }
}
