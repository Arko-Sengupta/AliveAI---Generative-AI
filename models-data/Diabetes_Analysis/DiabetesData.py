import logging
import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.ERROR)
logging.basicConfig(level=logging.WARNING)

np.random.seed(42)

class DiabetesDataset:
    
    def __init__(self):
        self.samples = None
        
    def Age(self):
        try:
            ages = np.random.normal(loc=50, scale=15, size=self.samples).astype(int)
            ages = np.clip(ages, 18, 100)
            return ages
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def Gender(self):
        try:
            genders = np.random.choice(['Male', 'Female'], size=self.samples)
            return genders
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def Weight(self):
        try:
            self.weights = np.random.normal(loc=70, scale=15, size=self.samples)
            self.weights = np.clip(self.weights, 40, 150)
            return self.weights
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def Height(self):
        try:
            self.heights = np.random.normal(loc=1.7, scale=0.1, size=self.samples)
            self.heights = np.clip(self.heights, 1.4, 2.1)
            return self.heights
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def FamilyHistory(self):
        try:
            family_histories = np.random.choice(['Yes', 'No'], size=self.samples)
            return family_histories
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise
        
    def PhysicalActivityLevel(self):
        try:
            activity_levels = np.random.choice(['Low', 'Moderate', 'High'], size=self.samples)
            return activity_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def DietaryHabits(self):
        try:
            dietary_habits = np.random.choice(['Flexitarian',
                                               'Keto',
                                               'Mediterranean',
                                               'Paleo',
                                               'Pescatarian',
                                               'Non-Veg',
                                               'Whole Food Plant-Based',
                                               'Vegan',
                                               'Vegetarian'
                                              ], size=self.samples)
            return dietary_habits
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    def Ethinicity_Race(self):
        try:
            ethnicities = np.random.choice(['Caucasian', 
                                            'Asian', 
                                            'Hispanic/Latino', 
                                            'African/American',
                                            'Mixed/Multiethnic',
                                            'Middle Eastern/North African'
                                            ], size=self.samples)
            return ethnicities
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    def MedicationUse(self):
        try:
            medication_uses = np.random.choice(['Yes', 'No'], size=self.samples)
            return medication_uses
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def SleepQuality(self):
        try:
            sleep_qualities = np.random.choice(['Poor', 'Fair', 'Good', 'Excellent'], size=self.samples)
            return sleep_qualities
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def StressLevel(self):
        try:
            stress_levels = np.random.choice(['Low', 'Moderate', 'High'], size=self.samples)
            return stress_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def WaistCircumference(self):
        try:
            self.waist_circumferences = np.random.normal(loc=90, scale=15, size=self.samples)
            self.waist_circumferences = np.clip(self.waist_circumferences, 60, 150)
            return self.waist_circumferences
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def HipCircumference(self):
        try:
            self.hip_circumferences = np.random.normal(loc=100, scale=15, size=self.samples)
            self.hip_circumferences = np.clip(self.hip_circumferences, 70, 160)
            return self.hip_circumferences
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def WaistToHipRatio(self):
        try:
            waist_to_hip_ratios = self.waist_circumferences / self.hip_circumferences
            return waist_to_hip_ratios
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def SmokingStatus(self):
        try:
            smoking_statuses = np.random.choice(['Non-Smoker', 'Smoker'], size=self.samples)
            return smoking_statuses
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def FastingBloodGlucose(self):
        try:
            fasting_glucose = np.random.normal(loc=100, scale=15, size=self.samples)
            fasting_glucose = np.clip(fasting_glucose, 60, 200)
            return fasting_glucose
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def HbA1c(self):
        try:
            hba1c_levels = np.random.normal(loc=5.5, scale=1.0, size=self.samples)
            hba1c_levels = np.clip(hba1c_levels, 4.0, 10.0)
            return hba1c_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def BMI(self):
        try:
            bmi = self.weights / (self.heights ** 2)
            return bmi
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def CholesterolLevel(self):
        try:
            cholesterol_levels = np.random.normal(loc=200, scale=30, size=self.samples)
            cholesterol_levels = np.clip(cholesterol_levels, 100, 300)
            return cholesterol_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def DiabetesStatus(self, cholesterol_levels, fasting_glucose, bmi, waist_to_hip_ratios, hba1c_levels):
        try:
            conditions = [
                cholesterol_levels <= 110,
                fasting_glucose >= 126,
                bmi >= 28,
                waist_to_hip_ratios >= 1,
                hba1c_levels >= 6.5
            ]
            
            condition_sum = np.sum(conditions, axis=0)
            diabetes_statuses = (condition_sum >= 2).astype(int)
            return diabetes_statuses
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
    def PrepareData(self, samples=1000):
        try:
            self.samples = samples
            
            data = pd.DataFrame({
                       'Age': self.Age(),
                       'Gender': self.Gender(),
                       'Weight': self.Weight(),
                       'Height': self.Height(),
                       'Family History': self.FamilyHistory(),
                       'Physical Activity Level': self.PhysicalActivityLevel(),
                       'Dietary Habits': self.DietaryHabits(),
                       'Ethnicity/Race': self.Ethinicity_Race(),
                       'Medication Use': self.MedicationUse(),
                       'Sleep Duration/Quality': self.SleepQuality(),
                       'Stress Levels': self.StressLevel(),
                       'Waist Circumference': self.WaistCircumference(),
                       'Hip Circumference': self.HipCircumference(),
                       'Smoking Status': self.SmokingStatus(),
                       'Fasting Blood Glucose': self.FastingBloodGlucose(),
                       'HbA1c': self.HbA1c(),
                       'Waist-to-Hip Ratio': self.WaistToHipRatio(),
                       'BMI': self.BMI(),
                       'Cholesterol Level': self.CholesterolLevel(),
                       'Diabetes': self.DiabetesStatus(self.CholesterolLevel(),
                                                       self.FastingBloodGlucose(),
                                                       self.BMI(),
                                                       self.WaistToHipRatio(),
                                                       self.HbA1c()
                                                       )
                   })
            
            data.to_excel('models-data\Diabetes_Analysis\DiabetesData.xlsx', index=False)
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
        
if __name__=="__main__":
    
    Data = DiabetesDataset()
    Data.PrepareData(100000)