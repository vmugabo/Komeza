"""Small sklearn-compatible adapters used by the training notebook."""

from __future__ import annotations

import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin
from xgboost import XGBClassifier


class StringLabelXGBClassifier(BaseEstimator, ClassifierMixin):
    """Keep string class labels while using XGBoost's integer label interface."""

    def __init__(
        self,
        n_estimators=250,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        min_child_weight=1,
        reg_lambda=1.0,
        random_state=42,
        n_jobs=-1,
    ):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.learning_rate = learning_rate
        self.subsample = subsample
        self.colsample_bytree = colsample_bytree
        self.min_child_weight = min_child_weight
        self.reg_lambda = reg_lambda
        self.random_state = random_state
        self.n_jobs = n_jobs

    def fit(self, X, y):
        self.classes_, encoded = np.unique(np.asarray(y), return_inverse=True)
        self.estimator_ = XGBClassifier(
            n_estimators=self.n_estimators,
            max_depth=self.max_depth,
            learning_rate=self.learning_rate,
            subsample=self.subsample,
            colsample_bytree=self.colsample_bytree,
            min_child_weight=self.min_child_weight,
            reg_lambda=self.reg_lambda,
            objective="multi:softprob" if len(self.classes_) > 2 else "binary:logistic",
            num_class=len(self.classes_) if len(self.classes_) > 2 else None,
            eval_metric="mlogloss" if len(self.classes_) > 2 else "logloss",
            random_state=self.random_state,
            n_jobs=self.n_jobs,
        )
        self.estimator_.fit(X, encoded)
        return self

    def predict(self, X):
        encoded = self.estimator_.predict(X).astype(int)
        return self.classes_[encoded]

    def predict_proba(self, X):
        probabilities = self.estimator_.predict_proba(X)
        if probabilities.ndim == 1:
            probabilities = np.column_stack([1 - probabilities, probabilities])
        return probabilities
