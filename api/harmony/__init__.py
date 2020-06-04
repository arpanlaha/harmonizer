import logging

from azure.functions import HttpRequest, Context, HttpResponse
from azf_wsgi import AzureFunctionsWsgi
from __app__.application import app


def main(req: HttpRequest, context: Context) -> HttpResponse:
    try:
        return AzureFunctionsWsgi(app).main(req, context)
    except Exception as err:
        return err
