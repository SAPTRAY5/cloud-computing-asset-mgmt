from fastapi import FastAPI
import pandas as pd
import psycopg2
from sklearn.linear_model import LinearRegression
from datetime import datetime
import numpy as np

app = FastAPI()

def get_data():
    conn = psycopg2.connect(
        host="postgres",   # docker service name later
        database="assetdb",
        user="postgres",
        password="yourpassword"
    )

    df = pd.read_sql("SELECT * FROM \"Assets\";", conn)
    conn.close()
    return df


@app.get("/forecast")
def forecast():
    df = get_data()

    if df.empty:
        return {"message": "No data available"}

    df["purchasedate"] = pd.to_datetime(df["purchasedate"])
    df["year"] = df["purchasedate"].dt.year

    results = []

    for category in df["category"].unique():
        sub = df[df["category"] == category]

        yearly_counts = sub.groupby("year").size().reset_index(name="count")

        if len(yearly_counts) < 2:
            continue

        X = yearly_counts["year"].values.reshape(-1, 1)
        y = yearly_counts["count"].values

        model = LinearRegression()
        model.fit(X, y)

        next_year = datetime.now().year + 1
        prediction = model.predict([[next_year]])[0]

        results.append({
            "category": category,
            "predicted_next_year": int(prediction)
        })

    return results