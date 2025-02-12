import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///users.db'  # Usamos SQLite
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)  # Clave secreta para sesiones


    AUTH0_CLIENT_ID = "wIojBESVsw4yB7vKWTNkd0U3MkzlDwmL"
    AUTH0_CLIENT_SECRET = "9yNqoE0Tq6IcYDkF2zP43cRPMrSjzMHs9myk9pzYm3aBZ3DN9rgJmjwX9kUYMC8u"
    AUTH0_DOMAIN = "dev-oeffyhcpj6gbzh1h.us.auth0.com"
    AUTH0_CALLBACK_URL = "http://microservicio_usuarios:5000/callback"

    SWAGGER_URL = '/api-docs'
    API_URL = '/static/openapi.yaml'
