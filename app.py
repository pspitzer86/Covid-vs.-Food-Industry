from flask import Flask, render_template, redirect
import pandas as pd
import os
import sys
import src.db_connect as db

template_dir = os.path.abspath('./resources/templates')
static_dir = os.path.abspath('./resources/static')
cwd = os.getcwd()
print("Current Working Dir: " + str(cwd))
print("Template Dir: " + template_dir)
print("Static Dir: " + static_dir)

# Create an instance of Flask
app = Flask(__name__,
            static_url_path='', 
            static_folder=static_dir,
            template_folder=template_dir)

# DB Connector
my_connection = db.DBConnector() 

# Route to render index.html template using data from Mongo
@app.route("/")
def home():
    # Statement that finds all the items in the db and sets it to a variable
    salary_data = my_connection.get_raw_data("average-salary")

    # Render an index.html template and pass it the data you retrieved from the database   
    return render_template("index.html", salary=salary_data, tables=[salary_data.to_html(classes='data', index=False)], titles=salary_data.columns.values)

# Route that will run the update function
@app.route("/map")
def update():
    # Update the Mongo database using update and upsert=True
    salary_data = my_connection.get_raw_data("average-salary")
    # Redirect back to home page
    return render_template("map.html", salary=salary_data, tables=[salary_data.to_html(classes='data', index=False)], titles=salary_data.columns.values)


if __name__ == "__main__":
    app.run(debug=True)