import logging
import numpy as np
import pandas as pd
logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.ERROR)
logging.basicConfig(level=logging.WARNING)

from sklearn.preprocessing import StandardScaler

class LogisticRegressionPredictor:
    """
    Class Implements Logistic Regression with L2 Regularization (Ridge) and the Option to Scale the Data.
    """

    def __init__(self, learning_rate: float = 0.001, num_iterations: int = 10000, verbose: bool = True, regularization_strength: float = 0.1):
        """
        Initializes the LogisticRegressionPredictor with given Hypeparameters.

        Parameters:
            learning_rate (float): The learning rate for gradient descent. Default is 0.001.
            num_iterations (int): The number of iterations for training. Default is 10000.
            verbose (bool): Flag to enable verbose output during training. Default is True.
            regularization_strength (float): The strength of the L2 regularization term. Default is 0.1.
        """
        self.bias = None
        self.weights = None
        self.verbose = verbose
        self.scaler = StandardScaler()
        self.learning_rate = learning_rate
        self.num_iterations = num_iterations
        self.regularization_strength = regularization_strength

    def sigmoid(self, z: np.ndarray) -> np.ndarray:
        """
        Computes the sigmoid of the input z.

        Parameters:
            z (numpy.ndarray): Input array or matrix.

        Returns:
            numpy.ndarray: The sigmoid of the input.
        """
        try:
            return 1 / (1 + np.exp(-z))
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e
    
    def loss_function(self, y: np.ndarray, y_pred: np.ndarray) -> float:
        """
        Computes the loss function (binary cross-entropy loss with L2 regularization).

        Parameters:
            y (numpy.ndarray): The true labels.
            y_pred (numpy.ndarray): The predicted probabilities.

        Returns:
            float: The calculated loss value.
        """
        try:
            loss = -np.mean(y * np.log(y_pred) + (1 - y) * np.log(1 - y_pred))
            regularization_term = (self.regularization_strength / (2 * len(y))) * np.sum(np.square(self.weights))
            return loss + regularization_term
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e

    def fit(self, X: pd.DataFrame, y: np.ndarray) -> None:
        """
        Trains the logistic regression model using gradient descent.

        Parameters:
            X (pandas.DataFrame): Feature matrix for training data.
            y (numpy.ndarray): Target vector for training data.

        Returns:
            None
        """
        try:
            X, y = self.encode_data(X), y
            self.cols = list(X.columns)

            # Scale features
            X = self.scaler.fit_transform(X)
            
            # Initialize weights and bias
            self.weights = np.zeros(X.shape[1])
            self.bias = 0

            # Gradient Descent Loop
            for _ in range(self.num_iterations):
                
                linear_model = np.dot(X, self.weights) + self.bias
                y_pred = self.sigmoid(linear_model)
    
                dw = (1 / X.shape[0]) * np.dot(X.T, (y_pred - y)) + self.regularization_strength * self.weights
                db = (1 / X.shape[0]) * np.sum(y_pred - y)
 
                # Update weights and bias
                self.weights -= self.learning_rate * dw
                self.bias -= self.learning_rate * db
                
                if self.verbose and _ % 100 == 0:
                    loss = self.loss_function(y, y_pred)
                    print(f'Iteration: {_}, Loss: {loss}')
                   
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e
    
    def encode_data(self, df: pd.DataFrame, drop_first: bool = True) -> pd.DataFrame:
        """
        Encodes categorical variables into dummy variables.

        Parameters:
            df (pandas.DataFrame): The input DataFrame containing categorical features.
            drop_first (bool): Flag to drop the first category to avoid multicollinearity. Default is True.

        Returns:
            pandas.DataFrame: DataFrame with dummy variables.
        """
        try:
            return pd.get_dummies(df, drop_first=drop_first)
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e
        
    def ColPosition(self, X_test: pd.DataFrame) -> pd.DataFrame:
        """
        Aligns the test set columns with the training set columns.

        Parameters:
            X_test (pandas.DataFrame): The input test DataFrame.

        Returns:
            pandas.DataFrame: The test DataFrame with columns aligned.
        """
        try:
            for col in self.cols:
                if col not in X_test.columns:
                    position = self.cols.index(col)
                    X_test.insert(position, col, pd.Series([0] * len(X_test), name=col))
            return X_test
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e

    def predict(self, X_test: pd.DataFrame) -> np.ndarray:
        """
        Predicts the target labels for the given test data.

        Parameters:
            X_test (pandas.DataFrame): The test feature matrix.

        Returns:
            numpy.ndarray: Predicted probabilities for the test set.
        """
        try:
            X_test = self.encode_data(X_test)
            X_test = self.ColPosition(X_test)         
            X_test = self.scaler.transform(X_test)
            
            linear_model = np.dot(X_test, self.weights) + self.bias
            y_pred = self.sigmoid(linear_model)
            return y_pred
        except Exception as e:
            logging.error('An Error Occured: ', exc_info=e)
            raise e