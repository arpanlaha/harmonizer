import logging

from azure.functions import HttpRequest, Context, HttpResponse, WsgiMiddleware
from ..FlaskApp.wsgi import application


def main(req: HttpRequest, context: Context) -> HttpResponse:
    try:
        return WsgiMiddleware(application).main(req, context)
    except Exception as err:
        return str(err)
