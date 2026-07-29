import pandas as pd
import numpy as np

np.random.seed(42)
num_rows = 5000 

def generate_utility_csv(utility_name, min_consumption, max_consumption, filename):
    data = {
        'month': np.random.randint(1, 13, size=num_rows),
        'meter_type': np.random.choice(['bill', 'smart card', 'smart meter'], size=num_rows),
        'lag_1': np.random.randint(min_consumption, max_consumption, size=num_rows),
        'lag_2': np.random.randint(min_consumption, max_consumption, size=num_rows),
        'lag_3': np.random.randint(min_consumption, max_consumption, size=num_rows),
        'lag_4': np.random.randint(min_consumption, max_consumption, size=num_rows),
        'lag_5': np.random.randint(min_consumption, max_consumption, size=num_rows),
        'lag_6': np.random.randint(min_consumption, max_consumption, size=num_rows),
    }
    df = pd.DataFrame(data)
    
    df['consumption'] = df[['lag_1', 'lag_2', 'lag_3']].mean(axis=1) + (df['month'] * 2)
    
    conditions = [
        (df['meter_type'] == 'smart card'),
        (df['meter_type'] == 'smart meter'),
        (df['meter_type'] == 'bill')
    ]
    choices = [-15, 0, 15] 
    df['consumption'] += np.select(conditions, choices, default=0)
    
    df['consumption'] += np.random.normal(0, 5, size=num_rows) 
    
    df.to_csv(f'Datasets/{filename}', index=False)
    print(f"✅ تم إنشاء ملف: datasets/{filename}")

generate_utility_csv('electricity', 100, 600, 'electricity_data.csv')
generate_utility_csv('water', 10, 60, 'water_data.csv')
generate_utility_csv('gas', 20, 150, 'gas_data.csv')