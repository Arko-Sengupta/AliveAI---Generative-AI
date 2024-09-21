import pandas as pd
import numpy as np
import logging
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Set Up Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RandomForestPredictor:
    """A simple Random Forest-like predictor using decision trees for Cholesterol Level prediction."""

    def __init__(self, data: pd.DataFrame) -> None:
        """Initialize with the dataset."""
        self.data = data
        self.trees = []
        logger.info("RandomForestPredictor initialized.")

    class DecisionTree:
        """A simple Decision Tree implementation for regression."""
      
        def __init__(self, max_depth: int = 5) -> None:
            self.max_depth = max_depth
      
        def fit(self, X: pd.DataFrame, y: pd.Series) -> None:
            """Fit the decision tree on the given features and target."""
            self.tree = self._build_tree(X, y)
      
        def _build_tree(self, X: pd.DataFrame, y: pd.Series, depth: int = 0) -> dict:
            """Recursively build the decision tree."""
            if len(y.unique()) == 1 or depth >= self.max_depth:
                return y.mean()  # Return the mean of the target
      
            feature, threshold = self._best_split(X, y)
            if feature is None:
                return y.mean()
      
            left_indices = X[feature] <= threshold
            right_indices = X[feature] > threshold
            left_tree = self._build_tree(X[left_indices], y[left_indices], depth + 1)
            right_tree = self._build_tree(X[right_indices], y[right_indices], depth + 1)
      
            return {'feature': feature, 'threshold': threshold, 'left': left_tree, 'right': right_tree}
      
        def _best_split(self, X: pd.DataFrame, y: pd.Series) -> tuple:
            """Find the best feature and threshold to split on."""
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
                      
                    # Calculate MSE for this split
                    mse = self._mean_squared_error(y[left_indices], y[right_indices])
                    if mse < best_mse:
                        best_mse = mse
                        best_feature = feature
                        best_threshold = threshold
                  
            return best_feature, best_threshold
      
        def _mean_squared_error(self, left: pd.Series, right: pd.Series) -> float:
            """Calculate the mean squared error for a split."""
            left_mean = left.mean()
            right_mean = right.mean()
            return np.mean((left - left_mean) ** 2) + np.mean((right - right_mean) ** 2)
      
        def predict(self, X: pd.DataFrame) -> np.ndarray:
            """Predict using the decision tree."""
            return np.array([self._predict_row(x) for _, x in X.iterrows()])
      
        def _predict_row(self, x: pd.Series) -> float:
            """Predict a single row."""
            node = self.tree
            while isinstance(node, dict):
                feature = node['feature']
                threshold = node['threshold']
                if x[feature] <= threshold:
                    node = node['left']
                else:
                    node = node['right']
            return node
      
      
    def fit(self, X_train: pd.DataFrame, y_train: pd.Series, n_trees: int = 10) -> None:
        """Fit multiple decision trees to the training data."""
        i = 1
        for _ in range(n_trees):
            # Sample the data and reset index
            logger.info(f"Tree: {i}")
            i += 1
            
            X_sample = X_train.sample(frac=0.8, replace=True).reset_index(drop=True)
            y_sample = y_train.sample(frac=0.8, replace=True).reset_index(drop=True)
            
            tree = self.DecisionTree(max_depth=5)
            tree.fit(X_sample, y_sample)
            self.trees.append(tree)
    
        logger.info(f"Fitted {n_trees} decision trees.")

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """Make predictions using the fitted trees."""
        predictions = np.mean([tree.predict(X) for tree in self.trees], axis=0)
        return predictions

    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series) -> None:
        """Evaluate the model by calculating MSE and RMSE."""
        predictions = self.predict(X_test)
        mse = mean_squared_error(y_test, predictions)
        rmse = np.sqrt(mse)
        logger.info(f"Mean Squared Error (MSE): {mse:.4f}")
        logger.info(f"Root Mean Squared Error (RMSE): {rmse:.4f}")


if __name__ == "__main__":
    # Load the dataset
    dataset = pd.read_excel('DiabetesData.xlsx')

    # Separate features (X) and target (y)
    X = dataset.drop(columns=['Cholesterol Level', 'Diabetes'])[:10000]
    y = dataset['Cholesterol Level'][:10000]

    # Split the data into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and fit the Random Forest predictor
    predictor = RandomForestPredictor(data=dataset)
    predictor.fit(X_train, y_train, n_trees=50)

    # Evaluate the model on the test set
    predictor.evaluate(X_test, y_test)
