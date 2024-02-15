from django.http import JsonResponse
from django.shortcuts import render
from dj_rest_auth.views import LoginView
import requests
from urllib.parse import urlencode
from urllib.request import urlopen
import json
from django.conf import settings

import logging
logger = logging.getLogger(__name__)
# Create your views here.
class CustomLoginView(LoginView):
    def post(self, request, *args, **kwargs):

        # We take the recaptcha response from the frontend, and verify it with Google
        try:
            json_data = json.loads(request.body)

            # For testing, if the login has this token, we skip the verification
            if 'recaptcha_skip_token' in json_data and json_data['recaptcha_skip_token'] == settings.RECAPTCHA_SKIP_TOKEN:
                return super().post(request, *args, **kwargs)

            recaptcha_response_from_frontend = json_data['recaptcha_response']
        except KeyError:
            return JsonResponse({'error': 'Malformed data'}, status=400)

        siteverify_url = 'https://www.google.com/recaptcha/api/siteverify'
        remote_ip = request.META.get('REMOTE_ADDR')
        params_dict = {
            'secret': settings.RECAPTCHA_PRIVATE_KEY,
            'response': recaptcha_response_from_frontend,
            'remoteip': remote_ip,
        }
        params = urlencode(params_dict)
        data = urlopen(siteverify_url, params.encode('utf-8')).read()
        
        result = json.loads(data)
        success = result.get('success', None)

        # If the verification is successful, we continue with the login (from LoginView)
        if success != True:
            return JsonResponse({'error': 'Invalid Captcha'}, status=400)

        response = super().post(request, *args, **kwargs)

        return response
