"""Views for the api module."""

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from predictive_text.prediction import DefaultPredictor


@csrf_exempt
def  predict(request):
    """Returns a list of predictions for a given word."""

    try:
        json_data = json.loads(request.body.decode('utf-8'))
        sequence = json_data['sequence']
    except  ValueError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({
        "sequence": sequence,
        "suggestions": DefaultPredictor.search(sequence)
        })

@csrf_exempt
def  learn(request):
    """Learns a new word"""

    try:
        json_data = json.loads(request.body.decode('utf-8'))
        word = json_data['word']
    except  ValueError:
        return JsonResponse({
            "error": "Invalid JSON"
            }, status=400)

    DefaultPredictor.learn(word)
    return JsonResponse({
        "status": "OK",
        })
