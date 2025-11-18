using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;
using CaloriesTracker.Server.Services;
using GraphQL;
using GraphQL.Types;

public sealed class UserProfileMutation : ObjectGraphType
{
    public UserProfileMutation()
    {
        Field<NonNullGraphType<BooleanGraphType>>("updateDisplayName")
            .Argument<NonNullGraphType<IdGraphType>>("userId")
            .Argument<NonNullGraphType<StringGraphType>>("displayName")
            .ResolveAsync(async ctx =>
            {
                try
                {
                    var repo = ctx.RequestServices!.GetRequiredService<IUserProfileRepository>();
                    var userId = ctx.GetArgument<Guid>("userId");
                    var displayName = ctx.GetArgument<string>("displayName");
                    return await repo.UpdateDisplayNameAsync(userId, displayName).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new ExecutionError("Failed to update display name", ex);
                }
            });

        Field<NonNullGraphType<BooleanGraphType>>("updateBirthDate")
            .Argument<NonNullGraphType<IdGraphType>>("userId")
            .Argument<DateGraphType>("birthDate")
            .ResolveAsync(async ctx =>
            {
                try
                {
                    var repo = ctx.RequestServices!.GetRequiredService<IUserProfileRepository>();
                    var userId = ctx.GetArgument<Guid>("userId");

                    var birthDateRaw = ctx.GetArgument<DateTime?>("birthDate");
                    DateOnly? birthDate = birthDateRaw.HasValue
                        ? DateOnly.FromDateTime(birthDateRaw.Value)
                        : null;

                    return await repo.UpdateBirthDateAsync(userId, birthDate).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new ExecutionError("Failed to update birth date", ex);
                }
            });

        Field<NonNullGraphType<BooleanGraphType>>("updatePhysicalData")
            .Argument<NonNullGraphType<IdGraphType>>("userId")
            .Argument<NonNullGraphType<UserSex>>("sexType")
            .Argument<DecimalGraphType>("heightCm")
            .Argument<DecimalGraphType>("weightKg")
            .ResolveAsync(async ctx =>
            {
                try
                {
                    var repo = ctx.RequestServices!.GetRequiredService<IUserProfileRepository>();

                    var userId = ctx.GetArgument<Guid>("userId");
                    var sex = ctx.GetArgument<SexType>("sexType");
                    var heightCm = ctx.GetArgument<decimal?>("heightCm");
                    var weightKg = ctx.GetArgument<decimal?>("weightKg");

                    return await repo.UpdatePhysicalDataAsync(userId, sex, heightCm, weightKg).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new ExecutionError("Failed to update physical data", ex);
                }
            });

        Field<NonNullGraphType<BooleanGraphType>>("updatePreferredUnits")
            .Argument<NonNullGraphType<IdGraphType>>("userId")
            .Argument<NonNullGraphType<UserHeight>>("preferredHeightUnit")
            .Argument<NonNullGraphType<UserWeight>>("preferredWeightUnit")
            .ResolveAsync(async ctx =>
            {
                try
                {
                    var repo = ctx.RequestServices!.GetRequiredService<IUserProfileRepository>();

                    var userId = ctx.GetArgument<Guid>("userId");
                    var heightUnit = ctx.GetArgument<HeightUnit>("preferredHeightUnit");
                    var weightUnit = ctx.GetArgument<WeightUnit>("preferredWeightUnit");

                    return await repo.UpdatePreferredUnitsAsync(userId, heightUnit, weightUnit)
                                     .ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw new ExecutionError("Failed to update preferred units", ex);
                }
            });


        Field<NonNullGraphType<BooleanGraphType>>("patchUserProfile")
             .Argument<NonNullGraphType<UserProfileInputType>>("input")
             .ResolveAsync(async ctx =>
             {
                 try
                 {
                     var service = ctx.RequestServices!.GetRequiredService<UserProfileService>();

                     var input = ctx.GetArgument<UserProfileInputDto>("input");

                     var result = await service.PatchUserPhysicalAndUnitsAsync(
                         userId: input.UserId,

                         sexType: input.SexType,
                         sexSpecified: input.SexSpecified,

                         heightValue: input.HeightCm,
                         heightSpecified: input.HeightSpecified,
                         heightUnitIfSpecified: input.HeightSpecified ? input.PreferredHeightUnit : null,

                         weightValue: input.WeightKg,
                         weightSpecified: input.WeightSpecified,
                         weightUnitIfSpecified: input.WeightSpecified ? input.PreferredWeightUnit : null,

                         prefHeightUnit: input.PreferredHeightUnit,
                         prefHeightUnitSpecified: input.PreferredHeightUnitSpecified,

                         prefWeightUnit: input.PreferredWeightUnit,
                         prefWeightUnitSpecified: input.PreferredWeightUnitSpecified
                     ).ConfigureAwait(false);

                     return result;
                 }
                 catch (Exception ex)
                 {
                     throw new ExecutionError("Failed to patch user profile", ex);
                 }
             });
    }
}
