using GraphQL.Types;

public class UserProfileInputType : InputObjectGraphType
{
    public UserProfileInputType()
    {
        Name = "UserProfileInput";
        Description = "Input type for patching user profile fields selectively.";

        Field<NonNullGraphType<IdGraphType>>("userId");

        Field<BooleanGraphType>("displayNameSpecified");
        Field<StringGraphType>("userName");

        Field<BooleanGraphType>("sexSpecified");
        Field<UserSex>("sexType");

        Field<BooleanGraphType>("heightSpecified");
        Field<DecimalGraphType>("heightCm");

        Field<BooleanGraphType>("weightSpecified");
        Field<DecimalGraphType>("weightKg");

        Field<BooleanGraphType>("preferredHeightUnitSpecified");
        Field<UserHeight>("preferredHeightUnit");

        Field<BooleanGraphType>("preferredWeightUnitSpecified");
        Field<UserWeight>("preferredWeightUnit");
    }
}
