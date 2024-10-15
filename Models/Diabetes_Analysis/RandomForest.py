import pickle
import logging
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error

# Set Up Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RandomForestPredictor:
    """A Random Forest-like Predictor using Decision Trees for Cholesterol Level Prediction."""

    def __init__(self, data: pd.DataFrame) -> None:
        """Initialize with the Dataset."""
        self.data = data
        self.trees = []
        logger.info("RandomForestPredictor Initialized.")

    class DecisionTree:
        """A Decision Tree Implementation for Regression."""
      
        def __init__(self, max_depth: int = 5) -> None:
            self.max_depth = max_depth
      
        def fit(self, X: pd.DataFrame, y: pd.Series) -> None:
            """Fit the Decision Tree on the given Features and Target."""
            try:
                self.tree = self.Build_Tree(X, y)
            except Exception as e:
                logging.error("An Error Occured: ", exc_info=e)
                raise e
      
        def Build_Tree(self, X: pd.DataFrame, y: pd.Series, depth: int = 0) -> dict:
            """Recursively Build the Decision Tree."""
            try:
                if len(y.unique()) == 1 or depth >= self.max_depth:
                    return y.mean()  # Return the Mean of the Target
          
                feature, threshold = self.Best_Split(X, y)
                if feature is None:
                    return y.mean()
          
                left_indices = X[feature] <= threshold
                right_indices = X[feature] > threshold
                left_tree = self.Build_Tree(X[left_indices], y[left_indices], depth + 1)
                right_tree = self.Build_Tree(X[right_indices], y[right_indices], depth + 1)
          
                return {'feature': feature, 'threshold': threshold, 'left': left_tree, 'right': right_tree}
            except Exception as e:
                logging.error("An Error Occured: ", exc_info=e)
                raise e
      
        def Best_Split(self, X: pd.DataFrame, y: pd.Series) -> tuple:
            """Find the Best Feature and Threshold to Split on."""
            try:
                best_mse = float('inf')
                best_feature = None
                best_threshold = None
                  
                for feature in X.columns:
                    thresholds = X[feature].unique()
                    for threshold in thresholds:
                        left_indices = X[feature] <= threshold
                        right_indices = X[feature] > threshold
                          
                        if len(y[left_indices]) == 0 or len(y[right_indices]) == 0:
                            continue
                          
                        # Calculate MSE for this Split
                        mse = self.Mean_Squared_Error(y[left_indices], y[right_indices])
                        if mse < best_mse:
                            best_mse = mse
                            best_feature = feature
                            best_threshold = threshold
                      
                return best_feature, best_threshold
            except Exception as e:
                logging.error("An Error Occured: ", exc_info=e)
                raise e
      
        def Mean_Squared_Error(self, left: pd.Series, right: pd.Series) -> float:
            """Calculate the Mean Squared Error for a Split."""
            try:
                left_mean = left.mean()
                right_mean = right.mean()
                return np.mean((left - left_mean) ** 2) + np.mean((right - right_mean) ** 2)
            except Exception as e:
                logging.error("An Error Occured: ", exc_info=e)
                raise e
      
        def Predict(self, X: pd.DataFrame) -> np.ndarray:
            """Predict using the Decision Tree."""
            try:
                return np.array([self.Predict_Row(x) for _, x in X.iterrows()])
            except Exception as e:
                logging.error("An Error Occured: ", exc_info=e)
                raise e
      
        def Predict_Row(self, x: pd.Series) -> float:
            """Predict a Single Row."""
            try:
                node = self.tree
                while isinstance(node, dict):
                    feature = node['feature']
                    threshold = node['threshold']
                    if x[feature] <= threshold:
                        node = node['left']
                    else:
                        node = node['right']
                return node
            except Exception as e:
                logging.error("An Error Occured: ", exc_info=e)
                raise e
      
      
    def fit(self, X_train: pd.DataFrame, y_train: pd.Series, n_trees: int = 10) -> None:
        """Fit Multiple Decision Trees to the Training Data."""
        i = 1
        for _ in range(n_trees):
            # Sample the data and reset index
            logger.info(f"Tree: {i}")
            i += 1
            # End
            
            X_sample = X_train.sample(frac=0.8, replace=True).reset_index(drop=True)
            y_sample = y_train.sample(frac=0.8, replace=True).reset_index(drop=True)
            
            tree = self.DecisionTree(max_depth=5)
            tree.fit(X_sample, y_sample)
            self.trees.append(tree)
    
        logger.info(f"Fitted {n_trees} Decision Trees.")

    def Predict(self, X: pd.DataFrame) -> np.ndarray:
        """Make predictions using the fitted trees."""
        try:
            predictions = np.mean([tree.Predict(X) for tree in self.trees], axis=0)
            return predictions
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e

    def Evaluate(self, X_test: pd.DataFrame, y_test: pd.Series) -> None:
        """Evaluate the Model by Calculating MSE and RMSE."""
        try:
            predictions = self.Predict(X_test)
            mse = mean_squared_error(y_test, predictions)
            rmse = np.sqrt(mse)
            logger.info(f"Mean Squared Error (MSE): {mse:.4f}")
            logger.info(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
        except Exception as e:
            logging.error("An Error Occured: ", exc_info=e)
            raise e


if __name__ == "__main__":
    
    # Load the Dataset
    dataset = pd.read_excel('DiabetesData.xlsx')

    # Separate Features (X) and Target (y)
    X = dataset.drop(columns=['Cholesterol Level', 'Diabetes'])
    y = dataset['Cholesterol Level']
    
    # X_new = {
    #     "Age": 18,
    #     "Gender": "Female",
    #     "Weight": 140,
    #     "Height": 1.754298141,
    #     "Family History": "No",
    #     "Physical Activity Level": "Moderate",
    #     "Dietary Habits": "Non-Veg",
    #     "Ethnicity/Race": "Middle Eastern/North African",
    #     "Medication Use": "Yes",
    #     "Sleep Quality": "Poor",
    #     "Stress Levels": "Moderate",
    #     "Waist Circumference": 95.0,
    #     "Hip Circumference": 111.0,
    #     "Smoking Status": "Smoker",
    #     "Fasting Blood Glucose": 96.0,
    #     "HbA1c": 5.257904758,
    #     "Waist-to-Hip Ratio": 0.653846154,
    #     "BMI": 28.63505265
    # }
    # 
    # X_new = pd.DataFrame([X_new])
    
    # Initialize and Fit the Random Forest Predictor
    predictor = RandomForestPredictor(data=dataset)
    predictor.fit(X, y, n_trees=100)
    
    # p = predictor.Predict(X_new)
    # print(p)
    
    # with open('model.pkl', 'wb') as file:
    #     pickle.dump(predictor, file)

    # Evaluate the Model on the Test Set
    # predictor.Evaluate(X, y)