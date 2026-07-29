import os
import pandas as pd
import numpy as np
import lightgbm as lgb
import joblib

# 1. Ensure the models directory exists to save the frozen .pkl files
os.makedirs('models', exist_ok=True)

def train_and_save_model(utility_name, csv_path, model_save_path):
    print(f"\n==========================================")
    print(f"🔄 Starting Training for Utility: {utility_name.upper()}")
    print(f"==========================================")
    
    # 2. Check if the dataset CSV file exists
    if not os.path.exists(csv_path):
        print(f"❌ Error: Dataset file {csv_path} not found! Please run the Dataset Generator first.")
        return
        
    # Read the utility-specific dataset
    df = pd.read_csv(csv_path)
    
    # 3. Separate Features (X) and Target (y)
    # Drop 'consumption' because it is the target label we want to predict
    X = df.drop(columns=['consumption'])
    y = df['consumption']
    
    # 4. Cast 'meter_type' to category type so LightGBM natively processes it as a categorical feature
    X['meter_type'] = X['meter_type'].astype('category')
    
    # 5. Initialize the LightGBM Regressor with standard hyperparameters
    model = lgb.LGBMRegressor(
        objective='regression',
        metric='rmse',
        n_estimators=150,
        learning_rate=0.05,
        random_state=42,
        verbose=-1 # Hides detailed inner logs to keep the terminal clean
    )
    
    # 6. Train the model
    print(f"🏋️‍♂️ Training model on {len(df)} records...")
    model.fit(X, y)
    
    # 7. Freeze and save the trained model weights as a .pkl file
    joblib.dump(model, model_save_path)
    print(f"✅ Model saved successfully at: {model_save_path}")

# ========================================================
# Execute Training Loops for the Three Disjoint Utilities
# ========================================================

# Train Electricity Model
train_and_save_model('electricity', 'datasets/electricity_data.csv', 'models/electricity_lgb.pkl')

# Train Water Model
train_and_save_model('water', 'datasets/water_data.csv', 'models/water_lgb.pkl')

# Train Gas Model
train_and_save_model('gas', 'datasets/gas_data.csv', 'models/gas_lgb.pkl')

print("\n🎉 Success! All 3 utility models are trained, frozen, and ready for FastAPI deployment.")