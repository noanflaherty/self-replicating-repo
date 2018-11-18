# -*- coding: utf-8 -*-
from flask import render_template, Blueprint

bp = Blueprint('index', __name__,
                        template_folder='templates')


@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def index(path):
    return render_template('index.html')
