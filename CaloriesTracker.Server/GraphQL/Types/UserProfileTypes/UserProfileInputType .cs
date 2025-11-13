using GraphQL.Types;

namespace CaloriesTracker.Server.GraphQL.Types
{
    public class UserProfileInputType : InputObjectGraphType
    {
        public UserProfileInputType()
        {
            Name = "UserProfilePatchInput";
            Description = "Input type for patching user profile fields selectively.";

            Field<NonNullGraphType<IdGraphType>>("userId", "User ID to patch.");

            Field<BooleanGraphType>("sexSpecified", "Whether to update sex type.");
            Field<UserSex>("sexType", "Sex type to set if specified.");

            Field<BooleanGraphType>("heightSpecified", "Whether to update height.");
            Field<DecimalGraphType>("heightCm", "Height in centimeters.");

            Field<BooleanGraphType>("weightSpecified", "Whether to update weight.");
            Field<DecimalGraphType>("weightKg", "Weight in kilograms.");

            Field<BooleanGraphType>("preferredHeightUnitSpecified", "Whether to update preferred height unit.");
            Field<UserHeight>("preferredHeightUnit", "Preferred height unit (cm, inches, ft_in).");

            Field<BooleanGraphType>("preferredWeightUnitSpecified", "Whether to update preferred weight unit.");
            Field<UserWeight>("preferredWeightUnit", "Preferred weight unit (kg, lb, st_lb).");
        }
    }
}
