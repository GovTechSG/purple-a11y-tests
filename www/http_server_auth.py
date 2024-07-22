from http.server import HTTPServer, SimpleHTTPRequestHandler
import base64
import logging
import argparse

# Add this at the beginning of AuthHTTPRequestHandler
logging.basicConfig(level=logging.DEBUG)

# Define your username and password here
USERNAME = "username"
PASSWORD = "password"

class AuthHTTPRequestHandler(SimpleHTTPRequestHandler):
    """ Main class to present webpages and authentication. """

    def authenticate(self):
        auth_header = self.headers.get("Authorization")
        logging.debug(f"Authorization header received: {auth_header}")
        if auth_header:
            auth_token = auth_header.split(maxsplit=1)[-1]
            expected_auth = base64.b64encode(f"{USERNAME}:{PASSWORD}".encode()).decode()
            logging.debug(f"Expected auth token: {expected_auth}")
            return auth_token == expected_auth
        return False

    def do_HEAD(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

    def do_AUTHHEAD(self):
        self.send_response(401)
        self.send_header("WWW-Authenticate", 'Basic realm="Test"')
        self.send_header("Content-type", "text/html")
        self.end_headers()

    def do_GET(self):
        """ Handle GET requests. """
        if self.requires_authentication():
            if not self.authenticate():
                self.do_AUTHHEAD()
                self.wfile.write(b"Authentication required")
                return
        super().do_GET()

    def requires_authentication(self):
        """ Check if authentication is required based on requested path. """
        if self.path.startswith("/basicauth") and self.path.endswith(".html"):
            return True
        if self.path.startswith("/basicauth") and self.path.endswith(".xml"):
            return True
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--bind", "-b", metavar="ADDRESS", default="127.0.0.1",
                        help="Specify alternate bind address [default: all interfaces]")
    parser.add_argument("--port", "-p", metavar="PORT", default=8000, type=int,
                        help="Specify alternate port [default: 8000]")
    args = parser.parse_args()

    server_address = (args.bind, args.port)
    httpd = HTTPServer(server_address, AuthHTTPRequestHandler)

    server_url = f"http://{args.bind}:{args.port}/"
    print(f"Starting httpd server at: {server_url}")
    httpd.serve_forever()
