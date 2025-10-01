namespace CaloriesTracker.Server.Models
{
    public class FoodValidator
    {

        public void ValidateCreating(Food food)
        {
            ValidateCommonArgs(food);
        }

        public void ValidateUpdating(Food food, Guid userId)
        {
            ValidateCommonArgs(food);
            ValidateUserAccess(food, userId);
        }
        public void ValidateCommonArgs(Food food)
        {
            if (food == null)
                throw new ArgumentNullException(nameof(food),"Food can't be null");
            if (string.IsNullOrWhiteSpace(food.Name)) 
                throw new ArgumentException("Food name is required", nameof(food.Name));
            if (food.WeightG.HasValue && food.WeightG.Value <= 0)
                throw new ArgumentException("Weight must be positive", nameof(food.WeightG));
            if (food.ProteinG.HasValue && food.ProteinG.Value <= 0)
                throw new ArgumentException("Protein must be positive", nameof(food.ProteinG));
            if (food.FatG.HasValue && food.FatG.Value <= 0)
                throw new ArgumentException("Fat must be positive", nameof(food.FatG));
            if (food.FatG.HasValue && food.FatG.Value <= 0)
                throw new ArgumentException("Weight must be positive", nameof(food.FatG));
        }

        public void ValidateUserAccess(Food food, Guid userId)
        {
            if (food.Type == Models.Type.custom && food.UserId != userId)
                throw new UnauthorizedAccessException("Can't access other user's food");
        }
    }
}
