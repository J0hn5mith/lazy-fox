from django.http import JsonResponse
from predictive_text.prediction import Predictor, DefaultPredictor
import json
from django.views.decorators.csrf import csrf_exempt
import logging

@csrf_exempt
def  predict(request):
    p = DefaultPredictor
    try:
        json_data = json.loads(request.body.decode('utf-8'))
        sequence = json_data['sequence']
    except  ValueError as e:
        return JsonResponse({ "error": "Invalid JSON" }, status=400) 
    response = []
    return JsonResponse({
        "sequence": sequence,
        "suggestions": p.search(sequence)
        })

@csrf_exempt
def  learn(request):
    try:
        json_data = json.loads(request.body.decode('utf-8'))
        word = json_data['word']
    except  ValueError as e:
        return JsonResponse({
            "error": "Invalid JSON"
            }, status=400)
    DefaultPredictor.learn(word)
    return JsonResponse({
        "status": "OK",
        })


