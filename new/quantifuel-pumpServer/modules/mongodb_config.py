import os
import motor.motor_asyncio
from dotenv import load_dotenv

# ------------------------------
#  AUTHOR: jone_santhanaraj
# ------------------------------

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGODB_USERNAME = os.getenv("MONGODB_USERNAME")
MONGODB_PASSWORD = os.getenv("MONGODB_PASSWORD")
MONGODB_HOST = os.getenv("MONGODB_HOST", "localhost")
MONGODB_PORT = os.getenv("MONGODB_PORT", "27017")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "Quantifuel")

MONGODB_AUTHMECHANISM = os.getenv("MONGODB_AUTHMECHANISM", "SCRAM-SHA-256")
MONGODB_AUTHSOURCE = os.getenv("MONGODB_AUTHSOURCE", "Quantifuel")

MONGO_URI = f"mongodb+srv://{MONGODB_USERNAME}:{MONGODB_PASSWORD}@{MONGODB_HOST}/{MONGODB_DATABASE}?retryWrites=true&w=majority&appName=quantifuel"

# MongoDB Client
client = None
db = None


def connect_mongodb():
    global client, db
    try:
        print(
            f"Quantifuel ~pump :\nConnecting to MongoDB...\n   Host: {MONGODB_HOST}\n   Port: {MONGODB_PORT}\n   Database: {MONGODB_DATABASE}\n   Username: {MONGODB_USERNAME}\n"
        )
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
        db = client[MONGODB_DATABASE]
        print("Quantifuel ~pump :\n200 - OK > MongoDB connected successfully!")
        return {
            "status": 200,
            "isSuccess": True,
            "connection": client,
            "host": MONGODB_HOST,
            "port": MONGODB_PORT,
            "database": MONGODB_DATABASE,
            "username": MONGODB_USERNAME,
            "password": MONGODB_PASSWORD,
            "authMechanism": MONGODB_AUTHMECHANISM,
            "authSource": MONGODB_AUTHSOURCE,
        }
    except Exception as error:
        print(
            f"Quantifuel ~pump :\n500 - INTERNAL SERVER ERROR > An error occurred while trying to connect to DB: {error}"
        )
        return {
            "status": 500,
            "isSuccess": False,
            "error": str(error),
            "host": MONGODB_HOST,
            "port": MONGODB_PORT,
            "database": MONGODB_DATABASE,
            "username": MONGODB_USERNAME,
            "password": MONGODB_PASSWORD,
            "authMechanism": MONGODB_AUTHMECHANISM,
            "authSource": MONGODB_AUTHSOURCE,
        }


# Initialize connection
connect_mongodb()
