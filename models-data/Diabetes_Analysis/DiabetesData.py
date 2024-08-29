import logging
import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.ERROR)
logging.basicConfig(level=logging.WARNING)

np.random.seed(42)

class DiabetesDataset:
    
    """Initialized Number of Sample Data"""
    def __init__(self):
        self.samples = None
     
    """
    1. Getting Ages using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 50, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average Age as 50.
    3. scale = 40, Represents standard deviation of distribution that controls the spread of the generated age around
    the Mean (10, 90).
    4. size, Specifies the Random Ages to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 18 is the minimum value and any value less than 18 will be set to 18. Similarly 100 is the Maximum Value greater than 100
    will be set to 100.
    """
    def Age(self):
        try:
            ages = np.random.normal(loc=50, scale=40, size=self.samples).astype(int)
            ages = np.clip(ages, 18, 100)
            return ages
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
     
    """
    1. Getting Random Gender Array from the Given list of Array that selects gender randomly.
    2. ["Male", "Female"], Initially moving forward with two choices.
    3. size, Specifies the Random Genders to generate.
    """  
    def Gender(self):
        try:
            genders = np.random.choice(['Male', 'Female'], size=self.samples)
            return genders
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
     
    """
    1. Getting Weights using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 60, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average Weight as 60 Kgs.
    3. scale = 40, Represents standard deviation of distribution that controls the spread of the generated weights around
    the Mean (20, 100).
    4. size, Specifies the Random Weights to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 40 is the minimum value and any value less than 40 will be set to 40. Similarly 110 is the Maximum Value and any value
    greater than 110 will be set to 110.
    """   
    def Weight(self):
        try:
            self.weights = np.random.normal(loc=60, scale=40, size=self.samples)
            self.weights = np.clip(self.weights, 40, 150)
            return self.weights
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Heights using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 1.6, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average Height as 1.6 Metres.
    3. scale = 0.4, Represents standard deviation of distribution that controls the spread of the generated heights around
    the Mean (1.2, 2.0).
    4. size, Specifies the Random Heights to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 1.4 is the minimum value and any value less than 1.4 will be set to 1.4. Similarly 2.0 is the Maximum Value and any value
    greater than 2.0 will be set to 2.0.
    """    
    def Height(self):
        try:
            self.heights = np.random.normal(loc=1.6, scale=0.4, size=self.samples)
            self.heights = np.clip(self.heights, 1.4, 2.0)
            return self.heights
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Random Family History Array from the Given list of Array that selects history randomly.
    2. ["Yes", "No"], Initially moving forward with two choices.
    3. size, Specifies the Random Family History to generate.
    """    
    def FamilyHistory(self):
        try:
            family_histories = np.random.choice(['Yes', 'No'], size=self.samples)
            return family_histories
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise
    
    """
    1. Getting Random Physical Activity Level Array from the Given list of Array that selects physical activity randomly.
    2. ["Low", "Moderate", "High"], Initially moving forward with three choices.
    3. size, Specifies the Random Physical Activity Level to generate.
    """     
    def PhysicalActivityLevel(self):
        try:
            activity_levels = np.random.choice(['Low', 'Moderate', 'High'], size=self.samples)
            return activity_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Random Diatary Habits Array from the Given list of Array that selects diatary habits randomly.
    2. ['Flexitarian','Keto','Mediterranean','Paleo','Pescatarian','Non-Veg','Whole Food Plant-Based','Vegan','Vegetarian'], 
    Initially moving forward with ten choices.
    3. size, Specifies the Random Dietary Habits to generate.
    """     
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
    
    """
    1. Getting Random Ethinicity/Race Array from the Given list of Array that selects ethinicity/race randomly.
    2. ['Caucasian', 'Asian', 'Hispanic/Latino', 'African/American','Mixed/Multiethnic','Middle Eastern/North African'], 
    Initially moving forward with six choices.
    3. size, Specifies the Ethinicity/Race to generate.
    """  
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
    
    """
    1. Getting Random Medication Used Array from the Given list of Array that selects medication used randomly.
    2. ["Yes", "No"], Initially moving forward with two choices.
    3. size, Specifies the Random Medication Used to generate.
    """ 
    def MedicationUse(self):
        try:
            medication_uses = np.random.choice(['Yes', 'No'], size=self.samples)
            return medication_uses
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Random Sleep Quality Array from the Given list of Array that selects sleep quality randomly.
    2. ["Poor", "Fair", "Good", "Excellent"], Initially moving forward with four choices.
    3. size, Specifies the Sleep Quality to generate.
    """    
    def SleepQuality(self):
        try:
            sleep_qualities = np.random.choice(['Poor', 'Fair', 'Good', 'Excellent'], size=self.samples)
            return sleep_qualities
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Random Stress Level Array from the Given list of Array that selects stress level randomly.
    2. ["Low", "Moderate", "High"], Initially moving forward with three choices.
    3. size, Specifies the Stress Level to generate.
    """    
    def StressLevel(self):
        try:
            stress_levels = np.random.choice(['Low', 'Moderate', 'High'], size=self.samples)
            return stress_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Waist Circumferences using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 85, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average Waist circumference
    as 85 cm.
    3. scale = 10, Represents standard deviation of distribution that controls the spread of the generated waist circumferences around
    the Mean (75, 95).
    4. size, Specifies the Random Waist Circumferences to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 60 is the minimum value and any value less than 60 will be set to 60. Similarly 150 is the Maximum Value and any value
    greater than 150 will be set to 150.
    """    
    def WaistCircumference(self):
        try:
            self.waist_circumferences = np.random.normal(loc=85, scale=10, size=self.samples)
            self.waist_circumferences = np.clip(self.waist_circumferences, 60, 150)
            return self.waist_circumferences
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Waist Circumferences using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 103, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average Hip circumference
    as 103 cm.
    3. scale = 15, Represents standard deviation of distribution that controls the spread of the generated hip circumferences around
    the Mean (93, 113).
    4. size, Specifies the Random Hip Circumferences to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 70 is the minimum value and any value less than 70 will be set to 70. Similarly 160 is the Maximum Value and any value
    greater than 160 will be set to 160.
    """     
    def HipCircumference(self):
        try:
            self.hip_circumferences = np.random.normal(loc=103, scale=15, size=self.samples)
            self.hip_circumferences = np.clip(self.hip_circumferences, 70, 160)
            return self.hip_circumferences
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting the Ratio of Waist Circumference and Hip Circumference.
    2. Unit Considered is Centimeters.
    """    
    def WaistToHipRatio(self):
        try:
            waist_to_hip_ratios = self.waist_circumferences / self.hip_circumferences
            return waist_to_hip_ratios
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Random Smoking Status Array from the Given list of Array that selects somking status randomly.
    2. ["Non-Smoker", "Smoker"], Initially moving forward with two choices.
    3. size, Specifies the Smoking Status to generate.
    """    
    def SmokingStatus(self):
        try:
            smoking_statuses = np.random.choice(['Non-Smoker', 'Smoker'], size=self.samples)
            return smoking_statuses
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Fasting Blood Glucose using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 95, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average Fasting Blood Glucose
    as 95 mg/dl.
    3. scale = 12, Represents standard deviation of distribution that controls the spread of the generated hip circumferences around
    the Mean (83, 107).
    4. size, Specifies the Random Fasting Blood Glucose to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 60 is the minimum value and any value less than 60 will be set to 60. Similarly 140 is the Maximum Value and any value
    greater than 140 will be set to 140.
    """     
    def FastingBloodGlucose(self):
        try:
            fasting_glucose = np.random.normal(loc=95, scale=12, size=self.samples)
            fasting_glucose = np.clip(fasting_glucose, 60, 140)      
            return fasting_glucose
        except Exception as e:
            logging.error("An Error Occurred: ", exc_info=e)
            raise e
    
    
    """
    1. Getting HbA1c using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 5.5, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average HbA1c
    as 5.5 mg/dl.
    3. scale = 1.0, Represents standard deviation of distribution that controls the spread of the generated HbA1c around
    the Mean (4.5, 6.5).
    4. size, Specifies the Random HbA1c to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 4.0 is the minimum value and any value less than 4.0 will be set to 4.0. Similarly 10.0 is the Maximum Value and any value
    greater than 10.0 will be set to 10.0.
    """     
    def HbA1c(self):
        try:
            hba1c_levels = np.random.normal(loc=5.5, scale=1.0, size=self.samples)
            hba1c_levels = np.clip(hba1c_levels, 4.0, 10.0)
            return hba1c_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting the BMI using Weight and Height.
    2. Unit Considered is Kg/m^2.
    """      
    def BMI(self):
        try:
            bmi = self.weights / (self.heights ** 2)
            return bmi
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    
    """
    1. Getting Cholesterol Level using Normal (Gaussian) Distribution through NumPy Random Function.
    2. loc = 200, Represents the Mean (Average) of the Distribution. In this case we're considering it the Average Cholesterol Level
    as 200 mg/dl.
    3. scale = 40, Represents standard deviation of distribution that controls the spread of the generated cholesterol level around
    the Mean (160, 240).
    4. size, Specifies the Random Cholesterol Level to generate.
    5. clip(), is a NumPy Method that limits (clips) the values in an Array to specified Minimum and Maximum.
    6. Here 100 is the minimum value and any value less than 100 will be set to 100. Similarly 300 is the Maximum Value and any value
    greater than 300 will be set to 300.
    """     
    def CholesterolLevel(self):
        try:
            cholesterol_levels = np.random.normal(loc=200, scale=40, size=self.samples)
            cholesterol_levels = np.clip(cholesterol_levels, 100, 300)
            return cholesterol_levels
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e
    
    """
    1. Getting Diabetes 0 or 1 in General Conditions.
    2. For,
            Cholesterol Level > 200
            Fasting Blood Glucose >= 126
            BMI >= 28
            Waist to Hip Ratio >= 1
            HbA1c >= 6.5
    3. Conditions is a Boolean Array for all the Conditions.
    4. sum(), Sums up the "True" Value for each Sample.
    5. The condition then used to determine whether a sample is classified as having Diabetes ("1") or not ("0")
    based on whether two or more conditions are "True".
    """    
    def DiabetesStatus(self, cholesterol_levels, fasting_glucose, bmi, waist_to_hip_ratios, hba1c_levels):
        try:
            conditions = [
                cholesterol_levels > 200,
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
    
    """
    1. Gets all the Statistical Data and summerizes it into Relational Format.
    """    
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