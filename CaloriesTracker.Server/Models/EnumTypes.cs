namespace CaloriesTracker.Server.Models
{
    public enum SexType
    {
        male,
        female
    }

    public enum HeightUnit
    {
        cm,
        inches,
        ft_in
    }
    public enum WeightUnit
    {
        kg,
        lb,
        st_lb
    }
    public enum MealType
    {
        breakfast,
        lunch,
        dinner,
        snack,
        other
    }
    public enum Type
    {
        api,
        custom
    }

    public enum Plan
    {
        Balanced,
        HighProtein,
        LowCarb ,
        HighCarb ,
        Custom
    }
}
