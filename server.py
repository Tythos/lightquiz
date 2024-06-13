"""
"""

import os
import json
import flask
from gevent import pywsgi

PACK_PATH, _ = os.path.split(os.path.abspath(__file__))
_, APP_NAME = os.path.split(PACK_PATH)
SERVER_HOST = os.getenv("SERVER_HOST", "0.0.0.0")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))

APP = flask.Flask(APP_NAME)

@APP.route("/")
def index():
    """
    """
    return flask.send_file(PACK_PATH + "/public/index.html")

@APP.route("/<path:path>")
def public(path):
    """
    """
    return flask.send_from_directory(PACK_PATH + "/public", path)

@APP.route("/topic_areas.json", methods=["GET"])
def get_topic_areas():
    """
    """
    topic_areas = []
    for entry in os.listdir(PACK_PATH + "/topic_areas"):
        if os.path.isdir(PACK_PATH + "/topic_areas/%s" % entry):
            topic_areas.append(entry)            
    return json.dumps(topic_areas), 200, {
        "Content-Type": "application/json"
    }

def main():
    """
    """
    print("Hosting %s on %s at port %u..." % (APP_NAME, SERVER_HOST, SERVER_PORT))
    pywsgi.WSGIServer((SERVER_HOST, SERVER_PORT), APP).serve_forever()

if __name__ == "__main__":
    main()
