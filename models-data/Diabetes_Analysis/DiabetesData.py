import logging
import numpy as np
import pandas as pd

# Set Up Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

np.random.seed(42)

class DiabetesDataset:
    """Generates synthetic data for diabetes research."""

    def __init__(self, samples=1000):
        """Initialize the Dataset with the number of Samples."""
        self.samples = samples

    def _generate_data(self, mean, scale, low, high):
        """Generate Normally Distributed Data and Clip to a Specified Range."""
        try:
            data = np.random.normal(loc=mean, scale=scale, size=self.samples)
            return np.clip(data, low, high)
        except Exception as e:
            logger.error("Error Generating Data", exc_info=e)
            raise

    def Age(self):
        """Generate Ages between 18 and 100."""
        return self._generate_data(mean=50, scale=40, low=18, high=100)

    def Gender(self):
        """Generate Random Genders."""
        try:
            return np.random.choice(['Male', 'Female'], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Genders", exc_info=e)
            raise

    def Weight(self):
        """Generate Weights between 40 and 150 Kg."""
        return self._generate_data(mean=60, scale=40, low=40, high=150)

    def Height(self):
        """Generate Heights between 1.4 and 2.0 Meters."""
        return self._generate_data(mean=1.6, scale=0.4, low=1.4, high=2.0)

    def FamilyHistory(self):
        """Generate Family History of Diabetes."""
        try:
            return np.random.choice(['Yes', 'No'], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Family History", exc_info=e)
            raise

    def PhysicalActivityLevel(self):
        """Generate Physical Activity Levels."""
        try:
            return np.random.choice(['Low', 'Moderate', 'High'], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Physical Activity Levels", exc_info=e)
            raise

    def DietaryHabits(self):
        """Generate Dietary Habits."""
        try:
            return np.random.choice([
                'Flexitarian', 'Keto', 'Mediterranean', 'Paleo', 'Pescatarian',
                'Non-Veg', 'Whole Food Plant-Based', 'Vegan', 'Vegetarian'
            ], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Dietary Habits", exc_info=e)
            raise

    def Ethnicity_Race(self):
        """Generate Ethnicities/Races."""
        try:
            return np.random.choice([
                'Caucasian', 'Asian', 'Hispanic/Latino', 'African/American',
                'Mixed/Multiethnic', 'Middle Eastern/North African'
            ], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Ethnicity/Race", exc_info=e)
            raise

    def MedicationUse(self):
        """Generate Medication Use Status."""
        try:
            return np.random.choice(['Yes', 'No'], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Medication Use", exc_info=e)
            raise

    def SleepQuality(self):
        """Generate Sleep Quality."""
        try:
            return np.random.choice(['Poor', 'Fair', 'Good', 'Excellent'], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Sleep Quality", exc_info=e)
            raise

    def StressLevel(self):
        """Generate Stress Levels."""
        try:
            return np.random.choice(['Low', 'Moderate', 'High'], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Stress Levels", exc_info=e)
            raise

    def WaistCircumference(self):
        """Generate Waist Circumferences between 60 and 150 cm."""
        return self._generate_data(mean=85, scale=10, low=60, high=150)

    def HipCircumference(self):
        """Generate Hip Circumferences between 70 and 160 cm."""
        return self._generate_data(mean=103, scale=15, low=70, high=160)

    def WaistToHipRatio(self):
        """Calculate the Waist-to-Hip Ratio."""
        try:
            waist = self.WaistCircumference()
            hip = self.HipCircumference()
            return waist / hip
        except Exception as e:
            logger.error("Error Calculating Waist-to-Hip Ratio", exc_info=e)
            raise

    def SmokingStatus(self):
        """Generate Smoking Status."""
        try:
            return np.random.choice(['Non-Smoker', 'Smoker'], size=self.samples)
        except Exception as e:
            logger.error("Error Generating Smoking Status", exc_info=e)
            raise

    def FastingBloodGlucose(self):
        """Generate Fasting Blood Glucose levels between 60 and 140 mg/dl."""
        return self._generate_data(mean=95, scale=12, low=60, high=140)

    def HbA1c(self):
        """Generate HbA1c levels between 4.0 and 10.0."""
        return self._generate_data(mean=5.5, scale=1.0, low=4.0, high=10.0)

    def BMI(self):
        """Calculate BMI using weight and height."""
        try:
            weight = self.Weight()
            height = self.Height()
            return weight / (height ** 2)
        except Exception as e:
            logger.error("Error Calculating BMI", exc_info=e)
            raise

    def CholesterolLevel(self):
        """Generate Cholesterol Levels between 100 and 300 mg/dl."""
        return self._generate_data(mean=200, scale=40, low=100, high=300)

    def DiabetesStatus(self):
        """Determine Diabetes Status based on various Conditions."""
        try:
            cholesterol = self.CholesterolLevel()
            fasting_glucose = self.FastingBloodGlucose()
            bmi = self.BMI()
            waist_to_hip_ratio = self.WaistToHipRatio()
            hba1c = self.HbA1c()

            conditions = [
                cholesterol > 200,
                fasting_glucose >= 126,
                bmi >= 28,
                waist_to_hip_ratio >= 1,
                hba1c >= 6.5
            ]

            condition_sum = np.sum(conditions, axis=0)
            return (condition_sum >= 2).astype(int)
        except Exception as e:
            logger.error("Error Determining Diabetes Status", exc_info=e)
            raise

    def PrepareData(self):
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
        except Exception as e:
            logger.error("Error Preparing Data", exc_info=e)
            raise

if __name__ == "__main__":
    
    dataset = DiabetesDataset(samples=100000)
    dataset.PrepareData()