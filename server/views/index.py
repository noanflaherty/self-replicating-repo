# -*- coding: utf-8 -*-
from flask import render_template, Blueprint

index_view = Blueprint('index', __name__,
                        template_folder='templates')


@index_view.route('/')
def index():
    return render_template('index.html')
