import logging
import numpy as np
import pandas as pd

# Set Up Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

np.random.seed(42)


class DiabetesDataset:
    """Generates Synthetic Data for Diabetes Research."""

    def __init__(self, samples: int = 1000) -> None:
        """Initialize the Dataset with the Number of Samples."""
        self.samples = samples
        logger.info(f"Initialized Diabetes Dataset with {samples} Samples.")

    def Generate_Data(self, mean: float, scale: float, low: float, high: float, round_data: bool = True) -> np.ndarray:
        """Generate Normally Distributed Data and Clip to a Specified Range."""
        try:
            data = np.random.normal(loc=mean, scale=scale, size=self.samples)
            clipped_data = np.clip(data, low, high)
            logger.info(f"Generated Data with mean={mean}, scale={scale}, range=({low}, {high})")
            if round_data:
                return np.round(clipped_data)
            return clipped_data
        except Exception:
            logger.error("Error Generating Data", exc_info=True)
            raise
        
    def Generate_Categorical_Data(self, feature_name: str, categories: list) -> np.ndarray:
        """Generate Random Categorical Data."""
        try:
            data = np.random.choice(categories, size=self.samples)
            logger.info(f"Generated Categorical Data for {feature_name}.")
            return data
        except Exception:
            logger.error(f"Error Generating {feature_name} Data", exc_info=True)
            raise

    def Age(self) -> np.ndarray:
        """Generate Ages between 18 and 100."""
        return self.Generate_Data(mean=50, scale=40, low=18, high=100)

    def Gender(self) -> np.ndarray:
        """Generate Random Genders."""
        try:
            genders = np.random.choice(['Male', 'Female'], size=self.samples)
            logger.info("Generated Gender Data.")
            return genders
        except Exception:
            logger.error("Error Generating Genders", exc_info=True)
            raise

    def Weight(self) -> np.ndarray:
        """Generate Weights between 40 and 150 Kg."""
        return self.Generate_Data(mean=60, scale=40, low=40, high=150)

    def Height(self) -> np.ndarray:
        """Generate Heights between 1.4 and 2.0 Meters."""
        return self.Generate_Data(mean=1.6, scale=0.4, low=1.4, high=2.0, round_data=False)

    def FamilyHistory(self) -> np.ndarray:
        """Generate Family History of Diabetes."""
        return self.Generate_Categorical_Data('Family History', ['Yes', 'No'])

    def PhysicalActivityLevel(self) -> np.ndarray:
        """Generate Physical Activity Levels."""
        return self.Generate_Categorical_Data('Physical Activity Level', ['Low', 'Moderate', 'High'])

    def DietaryHabits(self) -> np.ndarray:
        """Generate Dietary Habits."""
        return self.Generate_Categorical_Data(
            'Dietary Habits',
            ['Flexitarian', 'Keto', 'Mediterranean', 'Paleo', 'Pescatarian', 'Non-Veg', 'Whole Food Plant-Based', 'Vegan', 'Vegetarian']
        )

    def Ethnicity_Race(self) -> np.ndarray:
        """Generate Ethnicities/Races."""
        return self.Generate_Categorical_Data(
            'Ethnicity/Race',
            ['Caucasian', 'Asian', 'Hispanic/Latino', 'African/American', 'Mixed/Multiethnic', 'Middle Eastern/North African']
        )

    def MedicationUse(self) -> np.ndarray:
        """Generate Medication Use Status."""
        return self.Generate_Categorical_Data('Medication Use', ['Yes', 'No'])

    def SleepQuality(self) -> np.ndarray:
        """Generate Sleep Quality."""
        return self.Generate_Categorical_Data('Sleep Quality', ['Poor', 'Fair', 'Good', 'Excellent'])

    def StressLevel(self) -> np.ndarray:
        """Generate Stress Levels."""
        return self.Generate_Categorical_Data('Stress Levels', ['Low', 'Moderate', 'High'])

    def WaistCircumference(self) -> np.ndarray:
        """Generate Waist Circumferences between 60 and 150 cm."""
        return self.Generate_Data(mean=85, scale=10, low=60, high=150)

    def HipCircumference(self) -> np.ndarray:
        """Generate Hip Circumferences between 70 and 160 cm."""
        return self.Generate_Data(mean=103, scale=15, low=70, high=160)

    def WaistToHipRatio(self) -> np.ndarray:
        """Calculate the Waist-to-Hip Ratio."""
        waist = self.WaistCircumference()
        hip = self.HipCircumference()
        return np.divide(waist, hip, where=hip != 0)  # Prevent Division by Zero

    def SmokingStatus(self) -> np.ndarray:
        """Generate Smoking Status."""
        return self.Generate_Categorical_Data('Smoking Status', ['Non-Smoker', 'Smoker'])

    def FastingBloodGlucose(self) -> np.ndarray:
        """Generate Fasting Blood Glucose levels between 60 and 140 mg/dl."""
        return self.Generate_Data(mean=95, scale=12, low=60, high=140)

    def HbA1c(self) -> np.ndarray:
        """Generate HbA1c levels between 4.0 and 10.0."""
        return self.Generate_Data(mean=5.5, scale=1.0, low=4.0, high=10.0, round_data=False)

    def BMI(self) -> np.ndarray:
        """Calculate BMI using Weight and Height."""
        weight = self.Weight()
        height = self.Height()
        return np.divide(weight, height ** 2, where=height != 0)  # Prevent Division by Zero

    def CholesterolLevel(self) -> np.ndarray:
        """Generate Cholesterol Levels between 100 and 300 mg/dl."""
        return self.Generate_Data(mean=200, scale=40, low=100, high=300)

    def DiabetesStatus(self) -> np.ndarray:
        """Determine Diabetes Status based on various Conditions."""
        cholesterol = self.CholesterolLevel()
        fasting_glucose = self.FastingBloodGlucose()
        bmi = self.BMI()
        waist_to_hip_ratio = self.WaistToHipRatio()
        hba1c = self.HbA1c()

        conditions = np.column_stack([
            cholesterol > 200,
            fasting_glucose >= 126,
            bmi >= 28,
            waist_to_hip_ratio >= 1,
            hba1c >= 6.5
        ])
        
        return (np.sum(conditions, axis=1) >= 2).astype(int)

    def Prepare_Data(self) -> None:
        """Generate the dataset and save it to an Excel file."""
        try:
            data = pd.DataFrame({
                'Age': self.Age(),
                'Gender': self.Gender(),
                'Weight': self.Weight(),
                'Height': self.Height(),
                'Family History': self.FamilyHistory(),
                'Physical Activity Level': self.PhysicalActivityLevel(),
                'Dietary Habits': self.DietaryHabits(),
                'Ethnicity/Race': self.Ethnicity_Race(),
                'Medication Use': self.MedicationUse(),
                'Sleep Quality': self.SleepQuality(),
                'Stress Levels': self.StressLevel(),
                'Waist Circumference': self.WaistCircumference(),
                'Hip Circumference': self.HipCircumference(),
                'Smoking Status': self.SmokingStatus(),
                'Fasting Blood Glucose': self.FastingBloodGlucose(),
                'HbA1c': self.HbA1c(),
                'Waist-to-Hip Ratio': self.WaistToHipRatio(),
                'BMI': self.BMI(),
                'Cholesterol Level': self.CholesterolLevel(),
                'Diabetes': self.DiabetesStatus()
            })

            data.to_excel('DiabetesData.xlsx', index=False)
            logger.info("Data Saved Successfully to 'DiabetesData.xlsx'.")
        except Exception:
            logger.error("Error preparing data", exc_info=True)
            raise


if __name__ == "__main__":
    
    dataset = DiabetesDataset(samples=100000)
    dataset.Prepare_Data()