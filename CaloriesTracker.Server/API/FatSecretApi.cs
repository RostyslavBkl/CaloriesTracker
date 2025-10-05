using CaloriesTracker.Server.Models;
using Microsoft.Extensions.Options;
using OAuth;
using System.Buffers.Text;
using System.Security.Cryptography;
using System.Text;

namespace CaloriesTracker.Server.API
{
    public class FatSecretApi
    {
        private readonly string _consKey;
        private readonly string _consSecret;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<FatSecretApi> _logger;

        public FatSecretApi(IOptions<FatSecretConfig> cfg, IHttpClientFactory httpClientFactory, ILogger<FatSecretApi> logger)
        {
            _consKey = cfg.Value.ConsumerKey;
            _consSecret = cfg.Value.ConsumerSecret;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        /*public async Task<string> SearchFoodAsync(string query)
        {
            var url = "https://platform.fatsecret.com/rest/foods/search/v1";

            var parameters = new Dictionary<string, string>
            {
                {"format", "json"},
                {"search_expression", query}
            };

            var oAuthClient = new OAuthRequest
            {
                Method = "GET",
                RequestUrl = url,
                ConsumerKey = _consKey,
                ConsumerSecret = _consSecret,
                SignatureMethod = OAuthSignatureMethod.HmacSha1,
                Version = "1.0"
            };

            Console.WriteLine($"Consumer key: {oAuthClient.ConsumerKey}, Secret ");

            var authHeader = oAuthClient.GetAuthorizationHeader(parameters);

            var queryString = string.Join("&", 
                parameters.Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));
            var fullUrl = $"{url}?{queryString}";

            var client = _httpClientFactory.CreateClient();
            var request = new HttpRequestMessage(HttpMethod.Get, fullUrl);
            request.Headers.TryAddWithoutValidation("Authorization", authHeader);

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var err = await response.Content.ReadAsStringAsync();
                _logger.LogError("API error: {Status} - {Error}", response.StatusCode, err);
                throw new Exception($"FatSecret Api error: {response.StatusCode}");
            }
            return await response.Content.ReadAsStringAsync();
        }*/

        public async Task<string> SearchFoodAsync(string query)
        {
            var url = "https://platform.fatsecret.com/rest/server.api";
            var httpMethod = "GET";

            // Всі параметри включаючи OAuth
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

            // Генеруємо підпис OAuth
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

            // Створюємо URL з усіма параметрами
            var queryString = string.Join("&", allParams.OrderBy(kvp => kvp.Key)
                .Select(kvp => $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value)}"));

            var fullUrl = $"{url}?{queryString}";

            _logger.LogInformation("Request URL: {Url}", fullUrl);

            // Відправляємо запит
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

        }
    }
