import logging
import pickle
import numpy as np
import pandas as pd
from typing import Union
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class RandomForestPredictor:
    """
    A class to Create and Train a RandomForest Model with Preprocessing Pipelines for Categorical and Numeric Data.
    """
    
    def __init__(self, n_estimators: int = 100, random_state: int = 24):
        """
        Initializes the RandomForestPredictor class with parameters and defines Preprocessing Pipelines.
        
        Parameters:
            n_estimators (int): The number of trees in the Random Forest Model.
            random_state (int): The seed used by the random number generator for reproducibility.
        """

        self.categorical_features = [
            'Gender',
            'Family History',
            'Physical Activity Level',
            'Dietary Habits', 
            'Ethnicity/Race',
            'Medication Use',
            'Sleep Quality',
            'Stress Levels',
            'Smoking Status'
        ]
        self.numeric_features = [
            'Age',
            'Weight',
            'Height',
            'Waist Circumference',
            'Hip Circumference', 
            'Fasting Blood Glucose',
            'HbA1c',
            'Waist-to-Hip Ratio',
            'BMI'
        ]
        
        self.n_estimators = n_estimators
        self.random_state = random_state
        self.model = self.__dataClassifier__()

    def __dataClassifier__(self) -> Pipeline:
        """
        Creates a Data Processing and Classification Pipeline.

        Returns:
            Pipeline: A scikit-learn Pipeline that preprocesses Data and fits a Random Forest Classifier.
        """
        try:
            categorical_transformer = Pipeline(steps=[
                ('imputer', SimpleImputer(strategy='most_frequent')),
                ('onehot', OneHotEncoder(handle_unknown='ignore'))
            ])
    
            numeric_transformer = Pipeline(steps=[
                ('imputer', SimpleImputer(strategy='mean')),
                ('scaler', StandardScaler())
            ])
    
            preprocessor = ColumnTransformer(
                transformers=[
                    ('cat', categorical_transformer, self.categorical_features),
                    ('num', numeric_transformer, self.numeric_features)
                ])
    
            model = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('classifier', RandomForestClassifier(n_estimators=self.n_estimators, random_state=self.random_state))
            ])
            return model

        except Exception as e:
            logging.error('An error occurred during model pipeline creation.', exc_info=True)
            raise e
            
    def fit(self, X: pd.DataFrame, y: Union[pd.Series, np.ndarray]) -> None:
        """
        Fits the Model to the provided Training Data.
        
        Parameters:
            X (pd.DataFrame): The Input features for Training.
            y (Union[pd.Series, np.ndarray]): The Target Values.
        """
        try:
            self.model.fit(X, y)
            logging.info("Model Training Completed Successfully.")
        except Exception as e:
            logging.error('An Error Occurred during Model Training.', exc_info=True)
            raise e
    
    def predict(self, X: pd.DataFrame) -> float:
        """
        Predicts the Target Value for the provided Input Data and returns the Mean of Predictions.
        
        Parameters:
            X (pd.DataFrame): The Input features for Prediction.
        
        Returns:
            float: The Mean Prediction Value.
        """
        try:
            predictions = self.model.predict(X)
            mean_prediction = np.mean(predictions)
            logging.info("Prediction Completed Successfully.")
            return mean_prediction
        except Exception as e:
            logging.error('An Error Occurred during Prediction.', exc_info=True)
            raise e

if __name__ == "__main__":
    
    # Load the Dataset
    # dataset = pd.read_excel('DiabetesData.xlsx')

    # Separate Features (X) and Target (y)
    # X = dataset.drop(columns=['Cholesterol Level', 'Diabetes'])
    # y = dataset['Cholesterol Level']
    
    # Initialize and Fit the Random Forest Predictor
    # predictor = RandomForestPredictor()
    # predictor.fit(X, y)
    
    # Save the model
    # with open('model.pkl', 'wb') as file:
    #     pickle.dump(predictor, file)
        
    # Load the model
    with open('model.pkl', 'rb') as file:
        predictor = pickle.load(file)
    
    # Evaluate the Model on the Test Set
    # predictor.Evaluate(X_test, y_test)

    # Predict on New Data
    X_new = pd.DataFrame([{
        "Age": 39,
        "Gender": "Female",
        "Weight": 99,
        "Height": 1.4,
        "Family History": "Yes",
        "Physical Activity Level": "Moderate",
        "Dietary Habits": "Paleo",
        "Ethnicity/Race": "Hispanic/Latino",
        "Medication Use": "No",
        "Sleep Quality": "Fair",
        "Stress Levels": "Low",
        "Waist Circumference": 82.0,
        "Hip Circumference": 82.0,
        "Smoking Status": "Smoker",
        "Fasting Blood Glucose": 77.0,
        "HbA1c": 6.08268928,
        "Waist-to-Hip Ratio": 1.034883721,
        "BMI": 28.57142857
    }])
    
    p = predictor.predict(X_new)
    print(p)