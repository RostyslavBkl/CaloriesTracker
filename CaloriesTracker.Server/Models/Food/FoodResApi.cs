using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace CaloriesTracker.Server.Models
{
    public class FoodResApi
    {
        [JsonPropertyName("foods")]
        [JsonProperty("foods")]
        public FoodsApi Foods { get; set; }
    }

    public class FoodsApi
    {
        [JsonPropertyName("food")]
        [JsonProperty("food")]
        public List<FoodApi> Food { get; set; }
    }

    public class FoodApi
    {
        [JsonPropertyName("food_name")]
        [JsonProperty("food_name")]
        public string FoodName { get; set; }

        [JsonPropertyName("food_description")]
        [JsonProperty("food_description")]
        public string FoodDescription { get; set; }

        [JsonPropertyName("food_id")]
        [JsonProperty("food_id")]
        public string FoodId { get; set; }
    }
}
