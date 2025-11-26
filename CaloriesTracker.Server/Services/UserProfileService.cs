using CaloriesTracker.Server.Models;
using CaloriesTracker.Server.Repositories.Interfaces;

namespace CaloriesTracker.Server.Services
{
    public class UserProfileService
    {
        private readonly IUserProfileRepository userProfileRepository;
        public UserProfileService(IUserProfileRepository userProfileRepository)
        {
            this.userProfileRepository = userProfileRepository;
        }

        public static string MapSexTypeToDb(SexType sexType)
        {
            switch (sexType)
            {
                case SexType.male:
                    return "male";
                case SexType.female:
                    return "female";
                default:
                    throw new ArgumentException($"Unknown sex type: {sexType}");
            }
        }

        public static SexType MapSexTypeFromDb(string? dbValue)
        {
            var value = dbValue?.ToLowerInvariant();
            return value switch
            {
                "male" => SexType.male,
                "female" => SexType.female,
                null => throw new ArgumentException("Sex is NULL in DB"),
                _ => throw new ArgumentException($"Unknown sex type in DB: {dbValue}")
            };
        }

        public static string MapHeightUnitToDb(HeightUnit heightUnit)
        {
            switch (heightUnit)
            {
                case HeightUnit.cm:
                    return "cm";
                case HeightUnit.inches:
                    return "inches";
                case HeightUnit.ft_in:
                    return "ft_in";
                default:
                    throw new ArgumentException($"Unknown height unit: {heightUnit}");
            }
        }

        public static HeightUnit MapHeightUnitFromDb(string dbValue)
        {
            var value = dbValue?.ToLowerInvariant();
            switch (value)
            {
                case "cm":
                    return HeightUnit.cm;
                case "inches":
                    return HeightUnit.inches;
                case "ft_in":
                    return HeightUnit.ft_in;
                default:
                    throw new ArgumentException($"Unknown height unit in DB: {dbValue}");
            }
        }

        public static string MapWeightUnitToDb(WeightUnit weightUnit)
        {
            switch (weightUnit)
            {
                case WeightUnit.kg:
                    return "kg";
                case WeightUnit.lb:
                    return "lb";
                case WeightUnit.st_lb:
                    return "st_lb";
                default:
                    throw new ArgumentException($"Unknown weight unit: {weightUnit}");
            }
        }

        public static WeightUnit MapWeightUnitFromDb(string dbValue)
        {
            var value = dbValue?.ToLowerInvariant();
            switch (value)
            {
                case "kg":
                    return WeightUnit.kg;
                case "lb":
                    return WeightUnit.lb;
                case "st_lb":
                    return WeightUnit.st_lb;
                default:
                    throw new ArgumentException($"Unknown weight unit in DB: {dbValue}");
            }
        }

        public static class MeasurementConverter
        {
            public static decimal? ToCentimeters(decimal? value, HeightUnit unit)
            {
                if (value == null)
                    return null;
                if (unit == HeightUnit.cm)
                    return value;
                if (unit == HeightUnit.inches)
                    return value * 2.54m;
                if (unit == HeightUnit.ft_in)
                    return value * 30.48m;
                throw new ArgumentException($"Unknown height unit: {unit}");
            }

            public static decimal? ToKilograms(decimal? value, WeightUnit unit)
            {
                if (value == null)
                    return null;
                if (unit == WeightUnit.kg)
                    return value;
                if (unit == WeightUnit.lb)
                    return value * 0.453592m;
                if (unit == WeightUnit.st_lb)
                    return value * 6.35029m;
                throw new ArgumentException($"Unknown weight unit: {unit}");
            }
        }

        public async Task<bool> UpdateUserPhysicalDataAsync(
            Guid userId,
            decimal? heightValue,
            HeightUnit heightUnit,
            decimal? weightValue,
            WeightUnit weightUnit,
            SexType sexType)
        {
            var heightInCm = MeasurementConverter.ToCentimeters(heightValue, heightUnit);
            var weightInKg = MeasurementConverter.ToKilograms(weightValue, weightUnit);

            var physicalUpdated = await userProfileRepository.UpdatePhysicalDataAsync(
                userId, sexType, heightInCm, weightInKg);

            var unitsUpdated = await userProfileRepository.UpdatePreferredUnitsAsync(
                userId, heightUnit, weightUnit);

            return physicalUpdated && unitsUpdated;
        }

        public async Task<bool> PatchUserPhysicalAndUnitsAsync(
            Guid userId,
            SexType? sexType, bool sexSpecified,
            decimal? heightValue, bool heightSpecified, HeightUnit? heightUnitIfSpecified,
            decimal? weightValue, bool weightSpecified, WeightUnit? weightUnitIfSpecified,
            HeightUnit? prefHeightUnit, bool prefHeightUnitSpecified,
            WeightUnit? prefWeightUnit, bool prefWeightUnitSpecified,
            CancellationToken ct = default)
        {
            decimal? heightCm = null;
            if (heightSpecified)
            {
                if (heightValue is null) heightCm = null;
                else
                {
                    if (heightUnitIfSpecified is null)
                        throw new ArgumentException("heightUnitIfSpecified must be provided when heightSpecified is true and heightValue is not null");
                    heightCm = MeasurementConverter.ToCentimeters(heightValue, heightUnitIfSpecified.Value);
                }
            }

            decimal? weightKg = null;
            if (weightSpecified)
            {
                if (weightValue is null) weightKg = null;
                else
                {
                    if (weightUnitIfSpecified is null)
                        throw new ArgumentException("weightUnitIfSpecified must be provided when weightSpecified is true and weightValue is not null");
                    weightKg = MeasurementConverter.ToKilograms(weightValue, weightUnitIfSpecified.Value);
                }
            }

            var patch = new UserProfilePatch
            {
                UserId = userId,
                SexSpecified = sexSpecified,
                SexType = sexType,
                HeightSpecified = heightSpecified,
                HeightCm = heightCm,
                WeightSpecified = weightSpecified,
                WeightKg = weightKg,
                PreferredHeightUnitSpecified = prefHeightUnitSpecified,
                PreferredHeightUnit = prefHeightUnitSpecified
                    ? (prefHeightUnit is null ? null : MapHeightUnitToDb(prefHeightUnit.Value))
                    : null,
                PreferredWeightUnitSpecified = prefWeightUnitSpecified,
                PreferredWeightUnit = prefWeightUnitSpecified
                    ? (prefWeightUnit is null ? null : MapWeightUnitToDb(prefWeightUnit.Value))
                    : null
            };

            return await userProfileRepository.PatchUserProfileAsync(patch).ConfigureAwait(false);
        }
    }
}
