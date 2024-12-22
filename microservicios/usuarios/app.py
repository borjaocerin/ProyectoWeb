from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt
from flask_cors import CORS
from models import db, User
from config import Config
from datetime import timedelta
from authlib.integrations.flask_client import OAuth
import json
from flask import redirect, url_for
from flask_swagger_ui import get_swaggerui_blueprint
app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Cambia esto en producción
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Expira en 1 hora
swaggerui_blueprint = get_swaggerui_blueprint(app.config['SWAGGER_URL'], app.config['API_URL'])
app.register_blueprint(swaggerui_blueprint, url_prefix=app.config['SWAGGER_URL'])
CORS(app, supports_credentials=True)

db.init_app(app)
jwt = JWTManager(app)
from authlib.integrations.flask_client import OAuth

oauth = OAuth(app)
auth0 = oauth.register(
    'auth0',
    client_id=app.config['AUTH0_CLIENT_ID'],
    client_secret=app.config['AUTH0_CLIENT_SECRET'],
    client_kwargs={'scope': 'openid profile email'},
    server_metadata_url=f'https://{app.config["AUTH0_DOMAIN"]}/.well-known/openid-configuration'
)
# Lista negra para almacenar tokens invalidados
blacklist = set()

with app.app_context():
    db.create_all()  # Crear la base de datos

# Verificar si un token está en la lista negra
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    return jwt_payload['jti'] in blacklist

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')  
    password = data.get('password')

    # Verificar si el nombre de usuario ya existe
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Usuario ya existe."}), 400

    # Verificar si el correo electrónico ya está registrado
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "El correo electrónico ya está registrado."}), 400

    # Crear un nuevo usuario
    new_user = User(username=username, email=email)  # Asignar el email al nuevo usuario
    new_user.set_password(password)  # Configurar la contraseña

    # Agregar el nuevo usuario a la base de datos
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente."}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email') 
    password = data.get('password')

    # Buscar usuario por email en lugar de username
    user = User.query.filter_by(email=email).first()  
    if user and user.check_password(password):
        # Genera un token JWT
        access_token = create_access_token(identity=user.email)  # Puedes usar el username o el email
        return jsonify({
            "message": "Inicio de sesión exitoso.",
            "access_token": access_token,
            "username": user.username  # Añadir el nombre de usuario a la respuesta
        }), 200
    
    return jsonify({"message": "Credenciales inválidas."}), 401

# Ruta protegida como ejemplo
@app.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    email = get_jwt_identity()
    return jsonify({"message": "Acceso concedido", "email": email}), 200

@app.route('/logout', methods=['POST'])
def logout():
    try:
        return jsonify({"message": "Cierre de sesión exitoso."}), 200
    except Exception as e:
        print(f"Error en el logout: {str(e)}")  # Captura cualquier error
        return jsonify({"message": "Error al cerrar sesión."}), 500



    
@app.route('/auth0-login')
def auth0_login():
    redirect_uri = app.config['AUTH0_CALLBACK_URL']
    return auth0.authorize_redirect(redirect_uri)

@app.route('/callback', methods=['GET', 'POST'])
def callback():
    try:
        print("Iniciando el callback de Auth0...")

        # Obtener el token de acceso
        token = auth0.authorize_access_token()
        print("Token de acceso obtenido:", token)


        user_info = auth0.get(f'https://{app.config["AUTH0_DOMAIN"]}/userinfo').json()

        if not user_info:
            print("No se pudo obtener la información del usuario.")
            return jsonify({"message": "No se pudo obtener la información del usuario."}), 400

        print("Información del usuario:", user_info)

        email = user_info.get('email')
        username = user_info.get('nickname')

        if not email:
            print("No se encontró el email en la información del usuario.")
            return jsonify({"message": "No se encontró el email."}), 400

        # Buscar o crear el usuario en la base de datos
        user = User.query.filter_by(email=email).first()
        if not user:
            new_user = User(username=username, email=email)
            db.session.add(new_user)
            db.session.commit()
            print("Nuevo usuario creado:", username)

        # Generar el token JWT
        access_token = create_access_token(identity=email)
        print("JWT generado para el usuario:", email)

        # Redirigir al usuario a la página de productos o cualquier página que desees
        redirect_url = f"http://localhost:3000/auth/callback?access_token={access_token}&username={username}&email={email}"
        return redirect(redirect_url)
    except Exception as e:
        print(f"Error en el callback de Auth0: {str(e)}")
        return jsonify({"message": f"Error durante el inicio de sesión con Auth0: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
