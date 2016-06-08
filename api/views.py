from django.http import JsonResponse
from predictive_text.prediction import Predictor, DefaultPredictor
import json
from django.views.decorators.csrf import csrf_exempt
import logging

@csrf_exempt
def  predict(request):
    p = DefaultPredictor

    # with open('predictive_text/data/training_data.csv', 'r') as f:
        # p.train(f)
    # with open('predictive_text/data/verbs.csv', 'r') as f:
        # p._train_verbs(f)

    try:
        json_data = json.loads(request.body.decode('utf-8'))
        sequence = json_data['sequence']
    except  ValueError as e:
        print(request.body)
        print(e)
        return JsonResponse({
            "error": "Invalid JSON"
            }, status=400)



    response = []
    return JsonResponse({
        "sequence": sequence,
        "suggestions": p.search(sequence) 
        })

