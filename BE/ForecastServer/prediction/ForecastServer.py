from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
import joblib
import sys

app = FastAPI(title="Dynamic LightGBM Utility Predictor")

# Load trained models and enforce strict pipeline validation at startup
try:
    models = {
        'Electricity': joblib.load('models/electricity_lgb.pkl'),
        'Water': joblib.load('models/water_lgb.pkl'),
        'Gas': joblib.load('models/gas_lgb.pkl')
    }
    
except Exception as e:
    print(f"❌ CRITICAL ERROR: Failed to load pickle files. System shutting down. Details: {e}")
    sys.exit(1) # Halt the server immediately if weights are missing

class FeatureStructure(BaseModel):
    month: int
    meter_type: str
    previous_consumption: List[float]

class PredictionRequest(BaseModel):
    features: FeatureStructure

@app.post("/predict/{utility_type}")
def predict_utility_consumption(utility_type: str, request_data: PredictionRequest):
    # Validate utility type route parameter
    if utility_type not in models:
        raise HTTPException(status_code=400, detail="Unsupported utility type")
    
    model = models[utility_type]
    
    # Validate historical data window size before entering the try block
    lags = request_data.features.previous_consumption
    if len(lags) != 6:
        raise HTTPException(
            status_code=400, 
            detail="Insufficient historical data. Exactly 6 months of previous consumption required."
        )
        
    try:
        month = request_data.features.month
        meter_type = request_data.features.meter_type
        
        # Reconstruct the feature dictionary dynamically
        data_dict = {
            'month': [month],
            'meter_type': [meter_type]
        }
        for i, val in enumerate(lags):
            data_dict[f'lag_{i+1}'] = [val]
            
        # Convert dictionary to a Pandas DataFrame
        df = pd.DataFrame(data_dict)
        
        # Cast meter_type to category to match the training schema
        df['meter_type'] = df['meter_type'].astype('category')
        
        # Execute model inference
        prediction = model.predict(df)
        
        return {
            "success": True,
            "prediction": round(float(prediction[0]), 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Algorithm execution error: {str(e)}")