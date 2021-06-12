# Dependencies
import pymongo
import dns
import json
import pandas as pd
import os

class DBConnector:

    # init method or constructor
    def __init__(self):
        print(os.getcwd())
        self.config = None
        self.db = None
        # Get the config file
        with open("./src/config.json", "r") as jsonfile:
            self.config = json.load(jsonfile) # Reading the file
            print("Config file loading successful")
            jsonfile.close()

        conn = self.config["mongo_uri"]
        client = pymongo.MongoClient(conn)

        client.server_info() # Will throw an exception if DB is not connected. @TODO Add better handling of this

        # Define database and collection
        self.db = client[self.config["db_name"]]

    def get_raw_data(self, collection):
        my_db = self.config["db_name"]
        # This is pulling the entire collection
        cursor = self.db[collection].find()

        # Create the Dataframe and return it                  
        df = pd.DataFrame(list(cursor))
        return df


